module.exports = function(config) {
  config.set({
    frameworks: ["jasmine"],
    autowatch: true,
    singleRun: true,
    files: [
      'specs/re-base.spec.js'
    ],
    reporters: ["spec", "failed", "coverage"],
    browsers: ['Chrome'],
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