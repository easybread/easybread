/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsJest } = require('ts-jest/presets');
const baseConfig = require('../../jest.config');

const globalWatchIgnorePatterns = baseConfig.watchPathIgnorePatterns || [];

const baseConfigClone = { ...baseConfig };

delete baseConfigClone.testEnvironment;

module.exports = {
  ...baseConfigClone,
  preset: '@shelf/jest-mongodb',
  transform: tsJest.transform,
  watchPathIgnorePatterns: [...globalWatchIgnorePatterns, 'globalConfig']
};
