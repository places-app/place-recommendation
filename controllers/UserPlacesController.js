const async = require('async');
const Sequelize = require('../db/db');
const api = require('../utils/api');
// const redis = require('redis');

// const client = redis.createClient();

// client.on('connect', () => {
//   console.log('connected');
// });

module.exports = {
  getUserPlaces: (callback) => {
    Sequelize.query('SELECT * FROM users')
    .spread(users => {
      users.forEach(user => {
        const userId = user.id;
        const query = `SELECT * FROM "userPlaces" WHERE "userId" = ${userId}`;
        Sequelize.query(query, { raw: true })
        .then(data => {
          console.log(data);
        })
        //callback(id);
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
