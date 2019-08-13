const nodeExternals = require("webpack-node-externals");
module.exports = [
  {
    name: "server",
    mode: "production",
    entry: "./app.js",
    target: "node",
    externals: [nodeExternals()],
    output: {
      path: __dirname + "/dist/server",
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        }
      ]
    },
    resolve: {
      extensions: ["*", ".js"]
    }
  }
];
