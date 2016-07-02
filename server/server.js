// Load environment variables
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: './env/development.env' });
} else {
  require('dotenv').config({ path: './env/production.env' });
}

const express = require('express');
const app = express();
const db = require('../db/db');
const client = require('../db/redis');

// API routes
require('../routes/api-routes')(app);

db.authenticate()
  .then(err => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
  });

// const PlaceDetails = require('../controllers/PlaceDetailsController');
const getUserPlaces = require('../workers/getUserPlaces');
// const UserPlaces = require('../controllers/UserPlacesController');
// UserPlaces.getUserPlaces();
// UserPlaces.getPlaces();

app.listen(Number(process.env.PORT), process.env.HOST, () => {
  console.log(`listening *: ${process.env.PORT}`);
});
