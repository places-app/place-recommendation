const UserPlacesController = require('../controllers/UserPlacesController');
const Recommendation = require('../engine/recommendations');

exports.getRecommendations = () => {
  Promise.all([UserPlacesController.getPlaces(), UserPlacesController.getUserPlaces()])
  .then(results => {
    const placeTypes = results[0];
    const userPlaceTypes = results[1];
    Recommendation.comparePlaces(placeTypes, userPlaceTypes);
  })
  .catch(err => {
    console.log('Error getting places or user places types: ', err);
  });
};
