const { createClient } = require('redis');

function createRedisClient(url) {
  const client = createClient({ url });
  client.on('error', err => console.error('Redis Error', err));
  return client;
}

module.exports = createRedisClient;
