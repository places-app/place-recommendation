const async = require('async');
const Sequelize = require('../db/db');
let query;

module.exports = {
  getUserPlaces: () => {
    return new Promise((resolve, reject) => {
      let userPlaceTypes = [];
      query = 'SELECT * FROM users';
      // query for all users;
      Sequelize.query(query)
      .spread(users => {
        // iterate through each user
        async.eachSeries(users, (user, userCallback) => {
          const userId = user.id;
          query = `SELECT "userId", up."placeId", "typeId" FROM "userPlaces" AS up INNER JOIN "placeTypes" AS pt ON up."placeId" = pt."placeId" WHERE "userId" = ${userId}`;
          // query for all user places
          Sequelize.query(query)
          .then(userPlaces => {
            const placeTypes = userPlaces[0];
            userPlaceTypes.push(placeTypes);
            // end of one async iteration
            userCallback();
          })
          .catch(err => {
            console.log('Error querying user place types: ', err);
          });
        }, err => {
          if (err) {
            console.log('Error: ', err);
            reject(err);
          } else {
            // end of all async iterations
            console.log('Done querying user places types.');
            resolve(userPlaceTypes);
          }
        });
      })
      .catch(err => {
        console.log('Error querying users: ', err);
      });
    });
  },
  getPlaces: () => {
    return new Promise((resolve, reject) => {
      query = `SELECT pt."placeId", pt."typeId", places."name" FROM "placeTypes" AS pt INNER JOIN types ON pt."typeId" = types.id INNER JOIN places ON pt."placeId" = places.id`;
      // query for all place types
      Sequelize.query(query, { raw: true })
      .then(placesTypes => {
        resolve(placesTypes[0]);
      })
      .catch(err => {
        console.log('Error querying place types: ', err);
        reject(err);
      });
    });
  },
};
