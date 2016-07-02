const client = require('../db/redis');

module.exports = {
  getRecommendations: (req, res) => {
    const userId = req.params.userId;

    client.get(userId, (err, reply) => {
      if (err) {
        console.log("Error fetching from redis: ", err);
      } else {
        console.log(reply);
        res.status(200).send(reply);
      }
    });
  },
};
