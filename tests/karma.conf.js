var travis = process.env.TRAVIS;

module.exports = function(config) {
  config.set({
    frameworks: ["jasmine"],
    autowatch: true,
    singleRun: !!travis,
    files: [
      { pattern: 'specs/*.spec.js', watched: false }
    ],
    reporters: ["spec", "failed", "coverage"],
    browsers: [travis ? 'Firefox' : 'Chrome'],
    preprocessors: {
    'specs/*.spec.js': ['webpack'],
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
              presets: ['es2015', 'react']
            }
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      reporters: [
        {
          type: "lcovonly",
          dir: "coverage",
          subdir: "."
        },
        {
          type: "text-summary"
        }
      ]
    }
  });
};
