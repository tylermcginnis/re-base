module.exports = {
  entry: "./app/App.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'},
      { test: /\.js$/, loader: 'babel', exclude: [/node_modules/] }
    ]
  }
};