var webpack = require('webpack');

module.exports = {
   entry: [
     './src/App.js'
   ],
   output: {
     path: __dirname + '/dist',
     filename: 'bundle.js',
     publicPath: '/'
   },
   module: {
     loaders: [
       { test: /\.js$/, loader: 'babel-loader', exclude: [/node_modules/]  }
      ]
   }
};

