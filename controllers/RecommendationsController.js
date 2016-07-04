const client = require('../db/redis');

module.exports = {
  getRecommendations: (req, res) => {
    const userId = req.params.userId;
    client.lrange(userId, 0, -1, (err, reply) => {
      if (err) {
        console.log('Error fetching from redis: ', err);
      } else {
        console.log(reply);
        res.status(200).send(reply);
      }
    });
  },
};
