import bluebird from 'bluebird';
import redis from 'redis';
import * as log from '../../logging/logging';
bluebird.promisifyAll(redis);

let isConnected = false;

const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
  log.info('Successfully connected to Redis server');
  isConnected = true;
});

client.on('error', e => log.error(e));

client.on('end', () => {
  log.info('Connection to Redis server closed');
  isConnected = false;
});

const genKey = req => {
  return req.originalUrl;
};

export default {
  cache: duration => {
    return (req, res, data) => {
      if (isConnected) {
        const key = genKey(req);
        client.set(key, JSON.stringify(data), 'EX', duration);
        log.debug(`caching ${key} for ${duration} seconds`);
        res.json(data);
      }
    };
  },
  retrieve: async (req, res, next) => {
    if (isConnected) {
      const key = genKey(req);
      const data = await client.getAsync(key);
      if (data) {
        log.trace('Data retrieved from cache');
        res.set('Content-Type', 'application/json');
        return res.send(data);
      }
    }
    next();
  },
};
