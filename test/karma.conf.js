const {join} = require('path');
const sources = {
  lib: join(__dirname, '../src/**/*.ts'),
  test: join(__dirname, '**/*_test.ts')
};

module.exports = config => config.set({
  browsers: ['FirefoxHeadless'],
  coverageReporter: {
    dir: join(__dirname, '../var'),
    subdir: '.',
    type: 'lcovonly'
  },
  files: [sources.lib, sources.test],
  frameworks: ['mocha', 'karma-typescript'],
  karmaTypescriptConfig: {
    coverageOptions: {instrumentation: false},
    include: [sources.test],
    tsconfig: '../tsconfig.json'
  },
  plugins: [
    require('karma-coverage'),
    require('karma-firefox-launcher'),
    require('karma-mocha'),
    require('karma-typescript')
  ],
  preprocessors: {
    [sources.lib]: ['coverage', 'karma-typescript'],
    [sources.test]: ['karma-typescript']
  },
  reporters: ['coverage', 'progress'],
  singleRun: true
});