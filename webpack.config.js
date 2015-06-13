module.exports = {
  entry: "./src/rebase.js",
  output: {
    filename: "dist/bundle.js",
    libraryTarget: 'umd'
  },
  externals: [{
    'firebase': {
      root: 'Firebase',
      commonjs2: 'firebase',
      commonjs: 'firebase',
      amd: 'firebase'
    }
  }],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};

