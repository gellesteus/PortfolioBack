import bluebird from 'bluebird';
import redis from 'redis';
import mung from 'express-mung';
bluebird.promisifyAll(redis);

export default class cacheMiddleware {
  constructor(url, password) {
    this.client = redis.createClient({ password: password, url: url });

    /* Set up event listeners */
    this.client.on('connect', () => {
      console.log('Redis server connected successfully');
      this.connected = true;
    });
    this.client.on('error', e => console.log(e));
    this.client.on('end', () => {
      this.connected = false;
      console.log('Redis server disconnected');
    });
  }

  async retrieve(req, res, next) {
    /* Retrieves the data from the cache, or calls the next piece of middleware */
    if (this.connected) {
      const key = this.generateKey(req);
      const data = await this.client.get(key);
      if (data) {
        res.send(data);
      }
    }
    next();
  }

  cache(req, res, next) {
    /* Caches a response after it has been generated */
    if (this.connected) {
      const key = this.generateKey(req);
      /* Cached data has a lifespan of 1 hour */
      this.client.set(key, res.body, 'EX', 3600);
    }

    next();
  }

  generateKey(req) {
    let key = '';
    /* Build a key from the endpoint and the query parameters */
    console.log(req);
    return key;
  }
}
