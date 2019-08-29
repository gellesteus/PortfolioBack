import 'dotenv/config';
//import "./websocket/websocket";

import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import UserRouter from './routes/api/user';
import OrganizationRouter from './routes/api/organization';
import CharacterRouter from './routes/api/character';
import ArmoryRouter from './routes/api/armory';
import RuleRouter from './routes/api/rule';
import BestiaryRouter from './routes/api/bestiary';
import ForumRouter from './routes/api/forum';
import bodyParser from 'body-parser';
import addAPIInfo from './middleware/api/addAPIInfo';
import removePassword from './middleware/api/removePassword';
import ListEndpoints from 'express-list-endpoints';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import ImageRouter from './routes/api/image';
import CSRFRouter from './routes/api/csrf';
import CSRFMiddleware from './middleware/api/CSRF';
import Scheduler from './jobs/Scheduler';
import PruneSessionTokens from './jobs/PruneSessionTokens';
import Accepts from './middleware/api/Accepts';
import * as log from './logging/logging';
import logRequest from './middleware/api/logRequest';
log.info('Server starting');
const app = express();
const port = process.env.SERVER_PORT;

/* Connect to the database */
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`,
    { useNewUrlParser: true }
  )
  .then(() => log.info('Connected to database'))
  .catch(e => log.error(e));

log.trace('Preventing mongoose deprecation warnings');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

log.trace('Adding middleware');
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(fileUpload());

/* Add the body parsers */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logRequest);
app.use(Accepts);

/* Add global middleware */
app.use(addAPIInfo);
app.use(removePassword);

app.use(CSRFMiddleware);
/* Application level settings */
app.enable('etag');

/* Enable proxy to force https, only while the server is live */
if (process.env.NODE_ENV === 'live') {
  log.debug('Enabling trust proxy');
  app.enable('trust proxy');
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

/* Add the api info to all responses */
app.use(addAPIInfo);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/* Route for API Information */
app.get('/', (req, res) => {
  res.json({
    APIVersion: process.env.API_VERSION,
    time: moment().format(),
  });
});
log.trace('Done adding middleware');

log.trace('Registering routes');
/* Set up all routes */
app.use('/user', UserRouter);
app.use('/organization', OrganizationRouter);
app.use('/forum', ForumRouter);
app.use('/armory', ArmoryRouter);
app.use('/character', CharacterRouter);
app.use('/rule', RuleRouter);
app.use('/bestiary', BestiaryRouter);
app.use('/image', ImageRouter);
app.use('/csrf', CSRFRouter);

/* Catch all unmanaged routes */
app.all('*', (req, res) => {
  log.info('invalid uri accessed. Falling back to default route for request');
  res.status(404).json({
    success: false,
    message: 'The specified resource does not exist on the server',
  });
});
log.trace('done registering routes');

if (process.env.IS_WORKER === true) {
  log.debug('Server is a worker, enabling scheduler');
  /* Schedule jobs */
  Scheduler.schedule(PruneSessionTokens, 60, true);

  /* Start the scheduler */
  Scheduler.start(() => log.trace('Scheduler started'));
}

app.listen(port, () => {
  log.debug(ListEndpoints(app));
  log.info(`Server listening on port ${port}`);
});
