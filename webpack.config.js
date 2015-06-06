var fs = require('fs');

var node_modules = fs.readdirSync('node_modules').filter(function(x) { return x !== '.bin' });

node_modules = node_modules.map(function(item, index) {
  var obj = {};
  obj[item] = {
    commonjs2: item
  }
  return obj;
})

console.log(node_modules);



module.exports = {
  entry: "./src/rebase.js",
  output: {
    filename: "dist/bundle.js",
    libraryTarget: 'commonjs2'
  },
  externals: node_modules,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel'}
    ]
  }
};

