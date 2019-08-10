import 'dotenv/config';

import moment from 'moment';
import express from 'express';
import mongoose from 'mongoose';
import UserRouter from './routes/api/user';
import bodyParser from 'body-parser';
import OrganizationRouter from './routes/api/organization';
import CharacterRouter from './routes/api/character';
import RuleRouter from './routes/api/rule';
import addAPIInformation from './middleware/api/addAPIInformation';
import removePassword from './middleware/api/removePassword';
import authorization from './middleware/api/authorization';

const app = express();
const port = process.env.SERVER_PORT;

/* Connect to the database */
mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${
		process.env.MONGO_URI
	}`,
	{ useNewUrlParser: true }
);
/* Add the body parsers */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Add global middleware */
app.use(addAPIInformation);
app.use(removePassword);

/* Route for API Information */
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'Connected to API successfully',
	});
});

/* Set up routes */
app.use('/user', UserRouter);

/* Protect all other routes */
app.use(authorization);

app.use('/organization', OrganizationRouter);
app.use('/character', CharacterRouter);
app.use('/rule', RuleRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));
