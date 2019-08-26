module.exports = {
  verbose: true, // indicates whether each individual test should be reported during the run and whether logs are displayed
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/src/**/?(*.)+(spec|test).(js|ts)'],
  testEnvironment: 'node',
};
