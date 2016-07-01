const async = require('async');
const Sequelize = require('../db/db');
const client = require('../db/redis');
let query;

module.exports = {
  getUserPlaces: () => {
    query = 'SELECT * FROM users'
    Sequelize.query(query)
    .spread(users => {
      async.eachSeries(users, (user, userCallback) => {
        const userId = user.id;
        console.log(userId);
        query = `SELECT * FROM "userPlaces" WHERE "userId" = ${userId}`;
        Sequelize.query(query)
        .then(data => {
          console.log(data);
        })
      }, err => {
        if (err) {
          console.log('Error: ', err)
        } else {
          console.log('Done inserting types and place types.');
          placeCallback();
        });
    })
    .catch(err => {
      console.log(err);
    });
      
    // .then(places => {
    //   const gPlaceIds = [];
    //   places.forEach(place => {
    //     const id = place['place.gPlaceId'];
    //     if (id) {
    //       api.getPlaceDetails(id)
    //       .then(resp => {
    //         console.log(resp.data.result.types);
    //         client.rpush(place.id, resp.data.result.types, (err, reply) => {
    //           console.log(reply);
    //         });
    //       });
    //       gPlaceIds.push(id);
    //     }
    //   });

    //   console.log(gPlaceIds);
    // })
  },
};
