var fs = require('fs');

var node_modules = fs.readdirSync('node_modules').filter(function(x) { return x !== '.bin' });

module.exports = {
  entry: "./src/rebase.js",
  output: {
    filename: "dist/bundle.js"
  },
  externals: node_modules,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel'}
    ]
  }
};

