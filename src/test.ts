const testing = require('testing');

const tests = [
  `${__dirname}/app.js`,
  `${__dirname}/api/authorization.js`,
  `${__dirname}/api/updateLastOnline.js`,
  `${__dirname}/models/Character.js`,
  `${__dirname}/model/Organization.js`,
  `${__dirname}/model/User.js`,
  `${__dirname}/model/Rule.js`,
  `${__dirname}/routes/api/character.js`,
  `${__dirname}/routes/api/organization.js`,
  `${__dirname}/routes/api/rule.js`,
  `${__dirname}/routes/api/user.js`
];

testing.run(tests, callback);
