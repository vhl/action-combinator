module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/*.js'],
  coverageDirectory: 'public/js_coverage',
  coverageReporters: ['html'],
  moduleFileExtensions: [
    'js',
  ],
  modulePaths: ['src'],
  testMatch: ['<rootDir>/spec/**/*_spec.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
