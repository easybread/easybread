module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'block-scoped-var': 'error',
    'comma-dangle': ['error', 'never'],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'max-depth': 'error',
    'max-len': ['error', { code: 120 }, { tabWidth: 2 }],
    'no-bitwise': ['error', { allow: ['~'] }],
    'no-console': 'error', // Use debug instead
    'no-underscore-dangle': 'error',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    'no-use-before-define': ['error', { functions: false }],
    'no-var': 'error',
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'error',
    'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    '@typescript-eslint/no-inferrable-types': 0
  }
};
