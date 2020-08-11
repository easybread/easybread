module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  verbose: false,
  testRegex: '.(spec|test).tsx?$',
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.interface.ts'],
  globals: {
    'ts-jest': {
      diagnostics: true
    }
  }
};
