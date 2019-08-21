import bluebird from 'bluebird';
import redis from 'redis';
bluebird.promisifyAll(redis);

let isConnected = false;

const client = redis.createClient({
	url: process.env.REDIS_URL,
	password: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
	console.log('Redis connected');
	isConnected = true;
});

client.on('error', e => console.log(e));

client.on('end', () => {
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
				res.json(data);
			}
		};
	},
	retrieve: async (req, res, next) => {
		if (isConnected) {
			const key = genKey(req);
			const data = await client.getAsync(key);
			if (data) {
				res.set('Content-Type', 'application/json');
				res.send(data);
			}
		}
		next();
	},
};
