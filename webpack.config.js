var externals = {
  app: {
    'firebase/app': {
      root: 'firebase/app',
      commonjs2: 'firebase/app',
      commonjs: 'firebase/app',
      amd: 'firebase/app'
    }
  },
  database: {
    'firebase/database': {
      root: 'firebase/database',
      commonjs2: 'firebase/database',
      commonjs: 'firebase/database',
      amd: 'firebase/database'
    }
  },
  firebase: {
    'firebase': {
      root: 'firebase',
      commonjs2: 'firebase',
      commonjs: 'firebase',
      amd: 'firebase'
    }
  }
}

var loaders = [
  {
    test: /\.js$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      presets: ['es2015']
    }
  }
];

module.exports = [{
  entry: ['./src/rebase.js'],
  output: {
    filename: "dist/bundle.js",
    libraryTarget: 'umd'
  },
  externals: [
    externals.app, externals.database, externals.firebase
  ],
  module: {
    loaders: loaders
  }
}];
