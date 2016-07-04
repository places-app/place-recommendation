const util = require('../utils/helpers');

module.exports = {
  comparePlaces: (placeTypes, userPlaceTypes) => {
    const placesAndNames = util.mapPlacesAndNames(placeTypes);
    const places = placesAndNames[0];
    const placeNames = placesAndNames[1];

    userPlaceTypes.forEach(userPlaceType => {
      // map user places
      const userPlaces = util.mapUserPlaces(userPlaceType);
      const userId = userPlaces[0].userId;
      // map user types
      const userTypes = util.mapUserTypes(userPlaces);
      // compare user places with all places to get place rankings
      const placeRankings = util.comparePlaceTypes(userTypes, places);
      // sort recommendations
      const sortedRecs = util.sortPlaceRankings(placeRankings);
      // map recommendation to place names
      const recs = util.mapPlaceNames(sortedRecs, placeNames);
      // save recommendations for each user in redis
      util.saveRecs(userId, recs);
    });
  },
};
