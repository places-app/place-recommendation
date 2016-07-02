const _ = require('underscore');
const client = require('../db/redis');

// const userPlaces = () =>

module.exports = {
  comparePlaces: (placeTypes, userPlaceTypes) => {
    const results = _.chain(userPlaceTypes)
    .groupBy('userId')
    .map((val, key) => {
      return {
        userId: key,
        placeId: _.pluck(value, 'placeId'),
      };
    })
    .value();
    console.log(results);
    // userPlaceTypes.forEach(userPlaceType => {
    // })


    //client.

  },
};
