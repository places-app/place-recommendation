const RecommendationsController = require('../controllers/RecommendationsController');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Connected to recommendation service!');
  });
  // recommendations
  app.get('/api/recommendations/user/:userId/places', RecommendationsController.getRecommendations);
};
