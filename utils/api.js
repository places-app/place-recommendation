const axios = require('axios');
const serverUrl = 'https://maps.googleapis.com/maps';
const placeId = '?placeid=';
const latlng = '?latlng=';
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
  getPlaceId(lat, lng) {
    return axios({
      url: `/api/geocode/json${latlng}${lat},${lng}${key}`,
      method: 'get',
      baseURL: serverUrl,
      withCredentials: true,
    });
  },
};
