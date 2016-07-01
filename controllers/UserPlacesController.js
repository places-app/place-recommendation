const async = require('async');
const Sequelize = require('../db/db');
const client = require('../db/redis');
let query;

module.exports = {
  getUserPlaces: (callback) => {
    let userPlaceTypes = [];
    query = 'SELECT * FROM users'
    Sequelize.query(query)
    .spread(users => {
      async.eachSeries(users, (user, userCallback) => {
        const userId = user.id;
        console.log('user id', userId);
        query = `SELECT "userId", up."placeId", "typeId" FROM "userPlaces" AS up INNER JOIN "placeTypes" AS pt ON up."placeId" = pt."placeId" WHERE "userId" = ${userId}`;
        Sequelize.query(query)
        .then(userPlaces => {
          const placeTypes = userPlaces[0];
          console.log('user places', placeTypes);
          console.log('length', placeTypes.length);
          userPlaceTypes.push(placeTypes);
          console.log('user place types', userPlaceTypes);
          userCallback();
        })
        .catch(err => {
          console.log('Error querying user place types: ', err);
        });
      }, err => {
        if (err) {
          console.log('Error: ', err)
        } else {
          console.log('Done querying user places types.');
          callback(userPlaceTypes);
        }
      });
    })
    .catch(err => {
      console.log('Error querying users: ', err);
    });
  },
  getPlaces: (callback) => {
    query = `SELECT pt."placeId", pt."typeId", "name" FROM "placeTypes" AS pt INNER JOIN types ON pt."typeId" = types.id`;
    Sequelize.query(query, { raw: true })
    .then(placesTypes => {
      console.log('place types', placesTypes[0]);
      callback(placeTypes[0]);
    })
    .catch(err => {
      console.log('Error querying place types: ', err);
    });
  },
};
