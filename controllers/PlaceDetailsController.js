const async = require('async');
const Sequelize = require('../db/db');
const api = require('../utils/api');

module.exports = {
  getPlaceDetails: () => {
    Sequelize.query('SELECT * FROM places')
    .spread(results => {
      console.log(results);
      async.eachSeries(results, (result, resultCallback) => {
        const placeId = result.id;
        const gPlaceId = result.gPlaceId;
        console.log(placeId);
        console.log('place', gPlaceId);
        api.getPlaceDetails(gPlaceId)
        .then(res => {
          const types = res.data.result.types;
          console.log('types', types);
          async.eachSeries(types, (type, typeCallback) => {
            //const query = `SELECT id FROM types WHERE name = `
            const query = `INSERT INTO types (name, "createdAt", "updatedAt") SELECT 'n', current_timestamp, current_timestamp WHERE NOT EXISTS (SELECT id FROM TYPES WHERE NAME ='n') RETURNING id`;
            Sequelize.query(query, { raw: true })
            .then(data => {
              // if (data.length > 0) {
              //   console.log(data[0].id);
              //   const typeId = data[0].id;
              //   const placesQuery = `INSERT INTO "placeTypes" ("placeId", "typeId", "createdAt", "updatedAt") VALUES (${placeId}, ${typeId}, current_timestamp, current_timestamp)`;
              //   Sequelize.query(placesQuery);
              // }
              console.log('data', data.id);
              typeCallback();
            })
            .catch(err => {
              console.log('Error inserting: ', err);
              typeCallback();
              // resultCallback();
            });
          }, err => {
            if (err) {
              console.log('Error: ', err)
            } else {
              console.log('Done inserting.');
              resultCallback();
            }
          });
        })
        .catch(err => {
          console.log('Error fetching place details: ', err);
        });
        //resultCallback();
      }, err => {
        if (err) {
          console.log('Error: ', err)
        } else {
          console.log('Done iterating.');
        }
      });
    })
    .catch(err => {
      console.log('Error querying: ', err);
    });
  },
};
