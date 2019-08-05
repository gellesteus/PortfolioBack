import 'dotenv/config';

import moment from 'moment';
import express from 'express';
import mongoose from 'mongoose';
import mung from 'express-mung';
import UserRouter from './routes/api/user';
import OrganizationRouter from './routes/api/organization';
import CharacterRouter from './routes/api/character';

const app = express();
const port = process.env.SERVER_PORT;

/* Connect to the database */
mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${
		process.env.MONGO_URI
	}`,
	{ useNewUrlParser: true }
);

/* Route for API Information */
app.get('/', (req, res) => {
	res.json({
		APIVersion: process.env.API_VERSION,
		time: moment().format(),
	});
});
/* Authorization middleware */

/* Set up all routes */
app.use('/user', UserRouter);
app.use('/organization', OrganizationRouter);
app.use('/character', CharacterRouter);

/* Add the api info to all responses */
app.use(
	mung.json(function transform(body, req, res) {
		body.APIInfo = {
			APIVersion: process.env.API_VERSION,
			time: moment().format(),
		};
		return body;
	})
);

app.listen(port, () => console.log(`Server listening on port ${port}`));
