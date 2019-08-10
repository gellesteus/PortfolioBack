import "dotenv/config";
import "./websocket/websocket";

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
app.use("/character", CharacterRouter);
app.use("/forum", ForumRouter);
app.use("/armory", ArmoryRouter);
app.use("/character", CharacterRouter);
app.use("/rule", RuleRouter);

/* Add the api info to all responses */
app.use((req, res, next) => require("./middleware/api/addAPIInfo"));

app.listen(port, () => console.log(`Server listening on port ${port}`));
