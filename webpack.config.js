const path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    path: path.join(__dirname, 'bundle', 'server'),
    publicPath: '/',
    filename: 'server.js'
  },
  target: 'node',
  node: {
    fs: 'empty',
    net: 'empty',
    __dirname: false,
    __filename: false
  }
};
