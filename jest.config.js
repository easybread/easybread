module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  verbose: true,
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
