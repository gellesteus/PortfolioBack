var testing = require('testing');

var tests = [
	`${__dirname}/app.js`,
	`${__dirname}/models/Character.js`,
	`${__dirname}/model/Organization.js`,
	`${__dirname}/model/User.js`,
];

testing.run(tests, callback);
