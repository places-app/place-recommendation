const async = require('async');
const Sequelize = require('../db/db');
const api = require('../utils/api');
const client = require('../db/redis');
let query;

const insertPlaceTypes = (placeId, typeId, typeCallback) => {
  // insert type into placeTypes table
  query = `INSERT INTO "placeTypes" ("placeId", "typeId", "createdAt", "updatedAt") SELECT ${placeId}, ${typeId}, current_timestamp, current_timestamp WHERE NOT EXISTS (SELECT * FROM "placeTypes" WHERE "placeId" = ${placeId} AND "typeId" = ${typeId})`;
  Sequelize.query(query)
  .then(() => {
    // end of one inner async iteration
    typeCallback();
  })
  .catch(err => {
    console.log('Error inserting place type: ', err);
    // end of one inner async iteration
    typeCallback();
  });
};

// api call to google places api with google place id
const getPlaceAPIDetails = (placeId, gPlaceId, placeCallback) => {
  api.getPlaceDetails(gPlaceId)
  .then(res => {
    const types = res.data.result.types;
    // iterate through each type
    async.eachSeries(types, (type, typeCallback) => {
      // check if type exists
      query = `SELECT id FROM types WHERE name = '${type}'`;
      // query for all types where type matches
      Sequelize.query(query)
      .spread(typeResults => {
        let typeId;
        // if type doesn't exist, then insert into types table
        if (typeResults.length === 0) {
          query = `INSERT INTO types (name, "createdAt", "updatedAt") VALUES ('${type}', current_timestamp, current_timestamp) RETURNING id`;
          Sequelize.query(query)
          .then(typeInserted => {
            typeId = typeInserted[0].id;
            insertPlaceTypes(placeId, typeId, typeCallback);
          })
          .catch(err => {
            console.log('Error inserting type: ', err);
          });
        // if type exists, then insert into placeTypes table
        } else {
          typeId = typeResults[0].id;
          insertPlaceTypes(placeId, typeId, typeCallback);
        }
      })
      .catch(err => {
        console.log('Error querying type: ', err);
      });
    }, err => {
      if (err) {
        console.log('Error: ', err);
      } else {
        console.log('Done inserting types and place types.');
        // end of one outer async iteration
        placeCallback();
      }
    });
  })
  .catch(err => {
    console.log('Error fetching place details: ', err);
  });
};

module.exports = {
  getPlaceDetails: (prevPlaceId) => {
    query = `SELECT * FROM places WHERE id >= ${prevPlaceId}`;
    // query for all places where place id is greater than last queried place id
    Sequelize.query(query)
    .spread(places => {
      let rPlaceId;
      // iterate through each place
      async.eachSeries(places, (place, placeCallback) => {
        const placeId = place.id;
        let gPlaceId = place.gPlaceId;
        const name = encodeURIComponent(place.name);
        const lat = place.lat;
        const lng = place.lng;
        // set redis placeId to placeId from psql
        rPlaceId = placeId;
        if (gPlaceId === null) {
          api.getPlaceId(name, lat, lng)
          .then(res => {
            if (res.data.predictions.length > 0) {
              gPlaceId = res.data.predictions[0].place_id;
              query = `UPDATE places SET "gPlaceId" = '${gPlaceId}' WHERE id = ${placeId}`;
              Sequelize.query(query)
              .then(() => {
                getPlaceAPIDetails(placeId, gPlaceId, placeCallback);
              })
              .catch(err => {
                console.log('Error updating place: ', err);
              });
            } else {
              // end of one outer async iteration
              placeCallback();
            }
          })
          .catch(err => {
            console.log('Error fetching place id: ', err);
          });
        } else {
          getPlaceAPIDetails(placeId, gPlaceId, placeCallback);
        }
      }, err => {
        if (err) {
          console.log('Error: ', err);
        } else {
          // end of all outer async iterations
          console.log('Done inserting all place types.');
          // save place id to redis
          if (rPlaceId) {
            client.set('Place_ID', ++rPlaceId, (error, reply) => {
              if (error) {
                console.log('Error saving to redis: ', error);
              } else {
                console.log('Successfully saved to redis, STATUS:', reply);
              }
            });
          }
        }
      });
    })
    .catch(err => {
      console.log('Error querying places: ', err);
    });
  },
};
