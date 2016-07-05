const redis = require('redis');

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

client.on('connect', () => {
  console.log('Connected to redis.');
});

module.exports = client;
