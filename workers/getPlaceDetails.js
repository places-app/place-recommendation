const PlaceDetails = require('../controllers/PlaceDetailsController');
const client = require('../db/redis');

exports.getPlaceDetails = () => {
  client.get('Place_ID', (err, reply) => {
    if (err) {
      console.log("Error fetching from redis: ", err);
    } else {
      let placeId = 1;
      if (reply) {
        placeId = reply;
      }
      PlaceDetails.getPlaceDetails(placeId);
    }
  });
};
