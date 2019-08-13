import "dotenv/config";
//import "./websocket/websocket";

import moment from "moment";
import express from "express";
import mongoose from "mongoose";
import UserRouter from "./routes/api/user";
import OrganizationRouter from "./routes/api/organization";
import CharacterRouter from "./routes/api/character";
import ArmoryRouter from "./routes/api/armory";
import RuleRouter from "./routes/api/rule";
import ForumRouter from "./routes/api/armory";
import bodyParser from "body-parser";
import addAPIInfo from "./middleware/api/addAPIInfo";
import routeList from "./logging/routes";
import ListEndpoints from "express-list-endpoints";

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
  routeList.print(app);
  res.json({
    APIVersion: process.env.API_VERSION,
    time: moment().format()
  });
});

/* Set up all routes */
app.use("/user", UserRouter);
app.use("/organization", OrganizationRouter);
app.use("/character", CharacterRouter);
app.use("/forum", ForumRouter);
app.use("/armory", ArmoryRouter);
app.use("/character", CharacterRouter);
app.use("/rule", RuleRouter);

app.listen(port, () => {
  if (process.env.NODE_ENV === "debug") {
    routeList.print(app);
  }
  console.log(`Server listening on port ${port}`);
});

console.log(ListEndpoints(app));
