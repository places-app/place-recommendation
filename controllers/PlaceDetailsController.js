const async = require('async');
const Sequelize = require('../db/db');
const api = require('../utils/api');
let query;

module.exports = {
  getPlaceDetails: (placeId) => {
    // still need to implement get only places from redis last place id
    // save place id to redis db;
    console.log(placeId);
    query = `SELECT * FROM places WHERE id > ${placeId}`;
    Sequelize.query(query)
    .spread(places => {
      console.log('places', places);
      async.eachSeries(places, (place, placeCallback) => {
        const placeId = place.id;
        const gPlaceId = place.gPlaceId;
        console.log('place id', placeId);
        console.log('g place id', gPlaceId);
        api.getPlaceDetails(gPlaceId)
        .then(res => {
          const types = res.data.result.types;
          console.log('types', types);
          async.eachSeries(types, (type, typeCallback) => {
            query = `SELECT id FROM types WHERE name = '${type}'`
            Sequelize.query(query)
            .spread(typeResults => {
              let typeId;
              if (typeResults.length === 0) {
                // const query = `INSERT INTO types (name, "createdAt", "updatedAt") SELECT 'n', current_timestamp, current_timestamp WHERE NOT EXISTS (SELECT id FROM TYPES WHERE NAME ='n') RETURNING id`;
                query = `INSERT INTO types (name, "createdAt", "updatedAt") VALUES ('${type}', current_timestamp, current_timestamp) RETURNING id`;
                Sequelize.query(query)
                .then(typeInserted => {
                  typeId = typeInserted[0].id;
                  console.log('type id', typeId);
                  query = `INSERT INTO "placeTypes" ("placeId", "typeId", "createdAt", "updatedAt") VALUES (${placeId}, ${typeId}, current_timestamp, current_timestamp)`;
                  Sequelize.query(query)
                  .then(placeType => {
                    console.log('placeType', placeType);
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
              } else {
                typeId = typeResults[0].id;
                console.log('types id', typeId);
                query = `INSERT INTO "placeTypes" ("placeId", "typeId", "createdAt", "updatedAt") VALUES (${placeId}, ${typeId}, current_timestamp, current_timestamp)`;
                Sequelize.query(query)
                .then(placeType => {
                  console.log('placeType', placeType);
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
        }
      });
    })
    .catch(err => {
      console.log('Error querying places: ', err);
    });
  },
};
