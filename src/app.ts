import 'dotenv/config';

import * as express from 'express';
import moment from 'moment';
import mongoose from 'mongoose';

import UserRouter from './routes/api/user';
import OrganizationRouter from './routes/api/organization';
import CharacterRouter from './routes/api/character';
import ArmoryRouter from './routes/api/armory';
import RuleRouter from './routes/api/rule';
import BestiaryRouter from './routes/api/bestiary';
import ForumRouter from './routes/api/forum';
import addAPIInfo from './middleware/api/addAPIInfo';
import removePassword from './middleware/api/removePassword';

import ImageRouter from './routes/api/image';
import CSRFRouter from './routes/api/csrf';

import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import Accepts from './middleware/api/Accepts';
import CSRFMiddleware from './middleware/api/CSRF';

import PruneSessionTokens from './jobs/PruneSessionTokens';

import Scheduler from './jobs/Scheduler';

import * as log from './logging/logging';

log.info('Server starting');
const app: express.Application = express();
const port: number = +process.env.SERVER_PORT || 3001;

/* Connect to the database */
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`,
    { useNewUrlParser: true }
  )
  .then(() => log.info('Connected to database'))
  .catch((e: Error) => log.error(e.message));

log.trace('Preventing mongoose deprecation warnings');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

log.trace('Adding middleware');
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

app.use(fileUpload());

/* Add the body parsers */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    time: moment().format()
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
app.all('*', (req: express.Request, res: express.Response) => {
  log.info('invalid uri accessed. Falling back to default route for request');
  res.status(404).json({
    message: 'The specified resource does not exist on the server',
    success: false
  });
});
log.trace('done registering routes');

if (!!process.env.IS_WORKER === true) {
  log.debug('Server is a worker, enabling scheduler');
  /* Schedule jobs */
  Scheduler.schedule(PruneSessionTokens, 60, true);

  /* Start the scheduler */
  Scheduler.start(() => log.trace('Scheduler started'));
}

app.listen(port, () => {
  log.info(`Server listening on port ${port}`);
});
