import bluebird from 'bluebird';
import redis from 'redis';
bluebird.promisifyAll(redis);

let isConnected = false;

const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD
});

client.on('connect', () => {
  console.log('Redis connected');
  isConnected = true;
});

client.on('error', e => console.log(e));

client.on('end', () => {
  isConnected = false;
});

const genKey = req => {};

export default {
  cache: duration => {
    return (req, res, next) => {
      if (isConnected) {
        const key = genKey(req);
        client.set(key, res.body, 'EX', duration);
      }
      next();
    };
  },
  retrieve: async (req, res, next) => {
    if (isConnected) {
      const key = genKey(req);
      const data = await client.getAsync(key);
      if (data) {
        res.send(data);
      }
    }
    next();
  }
};
