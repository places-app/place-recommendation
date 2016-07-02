const async = require('async');
const Sequelize = require('../db/db');
const api = require('../utils/api');
const client = require('../db/redis');
let query;

module.exports = {
  getPlaceDetails: (placeId) => {
    query = `SELECT * FROM places WHERE id >= ${placeId}`;
    Sequelize.query(query)
    .spread(places => {
      let rPlaceId;
      // iterate through each place
      async.eachSeries(places, (place, placeCallback) => {
        const placeId = place.id;
        const gPlaceId = place.gPlaceId;
        rPlaceId = placeId;
        // api call to google places api with google place id
        api.getPlaceDetails(gPlaceId)
        .then(res => {
          const types = res.data.result.types;
          // iterate through each type
          async.eachSeries(types, (type, typeCallback) => {
            // check if type exists
            query = `SELECT id FROM types WHERE name = '${type}'`
            Sequelize.query(query)
            .spread(typeResults => {
              let typeId;
              // if type doesn't exist, then insert into types table
              if (typeResults.length === 0) {
                query = `INSERT INTO types (name, "createdAt", "updatedAt") VALUES ('${type}', current_timestamp, current_timestamp) RETURNING id`;
                Sequelize.query(query)
                .then(typeInserted => {
                  typeId = typeInserted[0].id;
                  // insert type into placeTypes table
                  query = `INSERT INTO "placeTypes" ("placeId", "typeId", "createdAt", "updatedAt") VALUES (${placeId}, ${typeId}, current_timestamp, current_timestamp)`;
                  Sequelize.query(query)
                  .then(placeType => {
                    typeCallback();
                  })
                  .catch(err => {
                    console.log('Error inserting place type: ', err);
                    typeCallback();
                  });
                })
                .catch(err => {
                  console.log('Error inserting type: ', err);
                });
              // if type exists, then insert into placeTypes table
              } else {
                typeId = typeResults[0].id;
                query = `INSERT INTO "placeTypes" ("placeId", "typeId", "createdAt", "updatedAt") VALUES (${placeId}, ${typeId}, current_timestamp, current_timestamp)`;
                Sequelize.query(query)
                .then(placeType => {
                  typeCallback();
                })
                .catch(err => {
                  console.log('Error inserting place type: ', err);
                  typeCallback();
                });
              }
            })
            .catch(err => {
              console.log('Error querying type: ', err);
            });
          }, err => {
            if (err) {
              console.log('Error: ', err)
            } else {
              console.log('Done inserting types and place types.');
              placeCallback();
            }
          });
        })
        .catch(err => {
          console.log('Error fetching place details: ', err);
        });
      }, err => {
        if (err) {
          console.log('Error: ', err)
        } else {
          console.log('Done inserting all place types.');
          // save place id to redis
          client.set("Place_ID", ++rPlaceId, (err, reply) => {
            if (err) {
              console.log("Error saving to redis: ", err);
            } else {
              console.log("Successfully saved to redis, STATUS:", reply);
            }
          });
        }
      });
    })
    .catch(err => {
      console.log('Error querying places: ', err);
    });
  },
};
