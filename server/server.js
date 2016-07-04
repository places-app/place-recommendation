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
const cron = require('node-cron');

// apply app to use middleware
require('../config/middleware')(app);

// API routes
require('../routes/api-routes')(app);

db.authenticate()
  .then(err => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
  });

// cron for workers
const GetUserPlaces = require('../workers/GetUserPlaces');
const GetPlaceDetails = require('../workers/GetPlaceDetails');

// get user places daily for recommendations
cron.schedule('*/15 * * * * *', () => {
  console.log('get places');
  GetUserPlaces.getRecommendations();
});
// get place details hourly
cron.schedule('*/10 * * * * *', () => {
  console.log('get user places');
  GetPlaceDetails.getPlaceDetails();
});

app.listen(Number(process.env.PORT), process.env.HOST, () => {
  console.log(`listening *: ${process.env.PORT}`);
});
