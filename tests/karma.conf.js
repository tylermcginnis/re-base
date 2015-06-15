module.exports = function(config) {
  config.set({
    frameworks: ["jasmine"],
    autowatch: true,
    singleRun: false,
    files: [
      'specs/re-base.spec.js'
    ],
    reporters: ["spec", "failed", "coverage"],
    browsers: ['Chrome'],
    preprocessors: {
    'specs/re-base.spec.js': ['webpack'],
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
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