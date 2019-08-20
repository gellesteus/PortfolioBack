import "dotenv/config";
//import "./websocket/websocket";

import express from "express";
import mongoose from "mongoose";
import moment from "moment";
import UserRouter from "./routes/api/user";
import OrganizationRouter from "./routes/api/organization";
import CharacterRouter from "./routes/api/character";
import ArmoryRouter from "./routes/api/armory";
import RuleRouter from "./routes/api/rule";
import BestiaryRouter from "./routes/api/bestiary";
import ForumRouter from "./routes/api/forum";
import bodyParser from "body-parser";
import addAPIInfo from "./middleware/api/addAPIInfo";
import removePassword from "./middleware/api/removePassword";
import ListEndpoints from "express-list-endpoints";
import cors from "cors";
import fileUpload from "express-fileupload";
import ImageRouter from "./routes/api/image";
import CSRFRouter from "./routes/api/csrf";
import CSRFMiddleware from "./middleware/api/CSRF";
import Scheduler from "./jobs/Scheduler";
import PruneCRFTokens from "./jobs/PruneCSRFTokens";
import PruneSessionTokens from "./jobs/PruneSessionTokens";

const app = express();
const port = process.env.SERVER_PORT;

/* Connect to the database */
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${
      process.env.MONGO_PASSWORD
    }@${process.env.MONGO_URI}`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to database"))
  .catch(e => console.log(`error connection to database: ${e}`));

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

app.use(fileUpload());

/* Add the body parsers */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Add global middleware */
app.use(addAPIInfo);
app.use(removePassword);

app.use(CSRFMiddleware);
/* Application level settings */
app.enable("etag");

/* Enable proxy to force https, only while the server is live */
if (process.env.NODE_ENV === "live") {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect("https://" + req.headers.host + req.url);
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
app.get("/", (req, res) => {
  res.json({
    APIVersion: process.env.API_VERSION,
    time: moment().format()
  });
});

/* Set up all routes */
app.use("/user", UserRouter);
app.use("/organization", OrganizationRouter);
app.use("/forum", ForumRouter);
app.use("/armory", ArmoryRouter);
app.use("/character", CharacterRouter);
app.use("/rule", RuleRouter);
app.use("/bestiary", BestiaryRouter);
app.use("/image", ImageRouter);
app.use("/csrf", CSRFRouter);

/* Catch all unmanaged routes */
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "The specified resource does not exist on the server"
  });
});

if (process.env.IS_WORKER) {
  /* Schedule jobs */
  Scheduler.schedule(PruneCRFTokens, 60, true);
  Scheduler.schedule(PruneSessionTokens, 60, true);

  /* Start the scheduler */
  Scheduler.start(() => console.log("Scheduler started"));
}

app.listen(port, () => {
  console.log(ListEndpoints(app));
  console.log(`Server listening on port ${port}`);
});
