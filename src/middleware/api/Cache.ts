import { Request, Response } from 'express';
import redis from 'redis';
import * as log from '../../logging/logging';

let isConnected = false;

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  url: process.env.REDIS_URL
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

const genKey = (req: Request) => {
  return req.originalUrl;
};

export default {
  cache: (duration: number) => {
    return (req: Request, res: Response, data: object): void => {
      if (isConnected) {
        const key = genKey(req);
        client.set(key, JSON.stringify(data), 'EX', duration);
        log.debug(`caching ${key} for ${duration} seconds`);
        res.json(data);
      }
    };
  },
  retrieve: async (
    req: Request,
    res: Response,
    next: () => void
  ): Promise<any> => {
    if (isConnected) {
      const key = genKey(req);
      client.get(key, (err: Error | null, data: string) => {
        if (data) {
          log.trace('Data retrieved from cache');
          res.set('Content-Type', 'application/json');
          res.send(data);
          return;
        }
      });
    }
    next();
  }
};
