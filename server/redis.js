const redis = require('redis');
const redisClient = redis.createClient({
  url: 'redis://localhost:6379', // Adjust the URL if you're using a remote Redis service
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect();

module.exports = redisClient;
