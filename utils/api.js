const axios = require('axios');
const serverUrl = 'https://maps.googleapis.com/maps';
const placeId = '?placeid=';
const input = '?input=';
const location = '&location=';
const key = `&key=${process.env.PLACES_KEY}`;

module.exports = {
  getPlaceDetails(gPlaceId) {
    return axios({
      url: `/api/place/details/json${placeId}${gPlaceId}${key}`,
      method: 'get',
      baseURL: serverUrl,
      withCredentials: true,
    });
  },
  getPlaceId(name, lat, lng) {
    return axios({
      url: `/api/place/autocomplete/json${input}${name}${location}${lat},${lng}${key}`,
      method: 'get',
      baseURL: serverUrl,
      withCredentials: true,
    });
  },
};
