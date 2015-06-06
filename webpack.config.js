module.exports = {
  entry: "./src/rebase.js",
  output: {
    filename: "dist/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel'}
    ]
  }
};
