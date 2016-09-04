var travis = process.env.TRAVIS;

module.exports = function(config) {
  config.set({
    frameworks: ["jasmine"],
    autowatch: true,
    singleRun: !!travis,
    files: [
      { pattern: 'specs/re-base.spec.js', watched: false }
    ],
    reporters: ["spec", "failed", "coverage"],
    browsers: [travis ? 'Firefox' : 'Chrome'],
    preprocessors: {
    'specs/re-base.spec.js': ['webpack'],
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel?optional[]=runtime',
            exclude: /node_modules/
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
