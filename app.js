import 'dotenv/config';

import moment from 'moment';
import express from 'express';
const app = express();
const port = process.env.SERVER_PORT;
const mongoose = require('mongoose');

app.get('/:value', (req, res) =>
	res.send(
		JSON.stringify({
			apiVersion: process.env.API_VERSION,
			value: req.params.value,
			time: moment().format(),
		})
	)
);

app.get('/organizations/:organization', (req, res) => {});

app.listen(port, () => console.log(`Server listening on port ${port}`));
