const PlaceDetails = require('../controllers/PlaceDetailsController');
const client = require('../db/redis');

client.get('Place_ID', (err, reply) => {
  if (err) {
    console.log("Error fetching from redis: ", err);
  } else {
    PlaceDetails.getPlaceDetails(reply);
  }
});
