// Load environment variables
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: './env/development.env' });
} else {
  require('dotenv').config({ path: './env/production.env' });
}

const express = require('express');
const app = express();
const db = require('../db/db');
require('../db/redis');
const cron = require('node-cron');

// apply app to use middleware
require('../config/middleware')(app);

// API routes
require('../routes/api-routes')(app);

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
  });

// cron for workers
const GetUserPlaces = require('../workers/GetUserPlaces');
const GetPlaceDetails = require('../workers/GetPlaceDetails');

// get user places daily for recommendations
cron.schedule(`${process.env.GET_RECS_TIMER}`, () => {
  GetUserPlaces.getRecommendations();
});
// get place details hourly
cron.schedule(`${process.env.GET_PLACES_TIMER}`, () => {
  GetPlaceDetails.getPlaceDetails();
});

app.listen(Number(process.env.PORT), process.env.HOST, () => {
  console.log(`listening *: ${process.env.PORT}`);
});
