const _ = require('underscore');
const client = require('../db/redis');

module.exports = {
  // map place types to places and place names
  mapPlacesAndNames: (placeTypes) => {
    const places = {};
    const placeNames = {};
    placeTypes.forEach(placeType => {
      const placeId = placeType.placeId;
      const typeId = placeType.typeId;
      const placeName = placeType.name;
      if (placeId in places) {
        places[placeId].push(typeId);
      } else {
        places[placeId] = [placeType.typeId];
      }
      placeNames[placeId] = placeName;
    });
    return [places, placeNames];
  },
  // map user place types to user places
  mapUserPlaces: (userPlaceType) => {
    const groups = _.groupBy(userPlaceType, value => {
      return value.userId + '#' + value.placeId;
    });
    const userPlaces = _.map(groups, group => {
      return {
        userId: group[0].userId,
        places: group[0].placeId,
        types: _.pluck(group, 'typeId'),
      };
    });
    return userPlaces;
  },
  // map user places to user types 
  mapUserTypes: (userPlaces) => {
    const userTypes = {};
    userPlaces.forEach(userPlace => {
      userPlace.types.forEach(type => {
        if (type in userTypes) {
          userTypes[type] += 1;
        } else {
          userTypes[type] = 1;
        }
      });
    });
    return userTypes;
  },
  // compare user place types with all place types
  comparePlaceTypes: (userTypes, places) => {
    const placeRankings = {};
    _.each(places, (types, placeId) => {    
      types.forEach(type => {
        _.each(userTypes, (count, typeId) => {
          if (type === Number(typeId)) {
            if (placeId in placeRankings) {
              placeRankings[placeId] += count;
            } else {
              placeRankings[placeId] = count;
            }
          }
        });
      });
    });
    return placeRankings;
  },
  // sort place rankings in descending order
  sortPlaceRankings: (placeRankings) => {
    const sortedRecs = [];
    _.each(placeRankings, (count, placeId) => {
      sortedRecs.push([placeId, count]);
    });
    sortedRecs.sort((a, b) => {
      return b[1] - a[1];
    })
    // return only first 10 sorted recommendations
    if (sortedRecs.length > 10) {
      return sortedRecs.slice(0, 10);
    }
    return sortedRecs;
  },
  // map sorted recommendation place ids to place names
  mapPlaceNames: (sortedRecs, placeNames) => {
    const recs = sortedRecs.map(rec => {
      const placeId = rec[0];
      return placeNames[placeId];
    });
    return recs;
  },
  // save recommendations to redis
  saveRecs: (userId, recs) => {
    client.del(userId , (err, reply) => {
      if (err) {
        console.log("Error deleting from redis: ", err);
      } else {
        console.log("Successfully deleted from redis, STATUS:", reply);
        client.rpush(userId.toString(), recs, (error, res) => {
          if (error) {
            console.log("Error saving to redis: ", error);
          } else {
            console.log("Successfully saved to redis, STATUS:", reply);
          }
        });
      }
    });
  },
};
