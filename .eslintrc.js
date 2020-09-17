module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  rules: {
    'simple-import-sort/sort': 'error',
    'block-scoped-var': 'error',
    'comma-dangle': ['error', 'never'],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true }
    ],
    'max-depth': 'error',
    'max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreUrls: true,
        ignorePattern: '^(import|export)'
      }
    ],
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
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true }
    ],
    semi: ['error', 'always'],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/camelcase': 1,
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: false
      }
    ]
  }
};
