const RecommendationsController = require('../controllers/RecommendationsController');

module.exports = (app) => {
  // recommendations
  app.get('/api/recommendations/user/:userId/places', RecommendationsController.getRecommendations);
}