import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import err from './error/err';
import Scheduler from './jobs/Scheduler';
import * as log from './logging/log';
import Accepts from './middleware/api/Accepts';
import addAPIInfo from './middleware/api/addAPIInfo';
import CSRFMiddleware from './middleware/api/CSRF';
import removePassword from './middleware/api/removePassword';
import ArmoryRouter from './routes/api/armory';
import BestiaryRouter from './routes/api/bestiary';
import CharacterRouter from './routes/api/character';
import CSRFRouter from './routes/api/csrf';
import ForumRouter from './routes/api/forum';
import ImageRouter from './routes/api/image';
import OrganizationRouter from './routes/api/organization';
import RuleRouter from './routes/api/rule';
import UserRouter from './routes/api/user';

log.info('Server starting');
const app: express.Application = express();

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

log.trace('Done adding middleware');

log.trace('Registering routes');

// Serve HTML
app.use(express.static(path.resolve(__dirname, '../client/build')));

/* Set up all routes */
app.use('/api/user', UserRouter);
app.use('/api/organization', OrganizationRouter);
app.use('/api/forum', ForumRouter);
app.use('/api/armory', ArmoryRouter);
app.use('/api/character', CharacterRouter);
app.use('/api/rule', RuleRouter);
app.use('/api/bestiary', BestiaryRouter);
app.use('/api/image', ImageRouter);
app.use('/api/csrf', CSRFRouter);

/* Let react router manage pages */
app.get('*', (req: express.Request, res: express.Response) => {
  log.trace('Requst for HTML site');
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

/* Catch all unmanaged routes */
app.all('*', (req: express.Request, res: express.Response) => {
  log.info('invalid uri accessed. Falling back to default route for request');
  res.status(404).json({
    message: 'The specified resource does not exist on the server',
    success: false,
  });
});

app.use(err);

log.trace('done registering routes');

if (!!process.env.IS_WORKER === true) {
  log.debug('Server is a worker, enabling scheduler');

  /* Start the scheduler */
  Scheduler.start(() => log.trace('Scheduler started'));
}

export default app;
