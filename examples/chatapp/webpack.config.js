var webpack = require('webpack');

module.exports = {
   plugins: [
   // new webpack.IgnorePlugin(/vertx/),
   // new webpack.NormalModuleReplacementPlugin(/^react$/, 'react/addons') 
   ],
   entry: [
     './src/app.jsx'
   ], 
   output: {
     path: __dirname + '/dist',
     filename: 'bundle.js',
     publicPath: '/'
   },
   module: {
     loaders: [
       { test: /\.jsx$/, loader: 'babel-loader', exclude: [/node_modules/]  }
      ]
   }                          
};

