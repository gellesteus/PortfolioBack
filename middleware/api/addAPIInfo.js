import mung from "express-mung";

/* Add information about the API to all routes */
export default (req, res, next) => {
  mung.json(function transform(body, req, res) {
    body.APIInfo = {
      APIVersion: process.env.API_VERSION,
      time: moment().format()
    };
    return body;
  });
};
