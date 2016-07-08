const chai = require('chai');
const expect = chai.expect;
chai.should();
let request = require('supertest');
require('dotenv').config({ path: './env/development.env' });
const key = `&key=${process.env.PLACES_KEY}`;

describe('Get Google Place ID from Geocode API', () => {
  before(done => {
    request = request('https://maps.googleapis.com/maps');
    done();
  });

  it('should return Google Place ID', done => {
    const lat = 37.7836845;
    const lng = -122.4090309;
    const name = 'Hack Reactor';
    const placeId = 'ChIJNc25vYWAhYARppFtCl9Stb0';
    request.
      get(`/api/place/autocomplete/json?input=${name}&location=${lat},${lng}${key}`)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.equal(200);
        expect(placeId).to.equal(JSON.parse(res.text).predictions[0].place_id);
        done();
      });
  });
});
