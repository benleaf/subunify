/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts','js','json'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
