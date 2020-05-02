const common = require('../../.eslintrc');
module.exports = {
  ...common,
  extends: common.extends.concat(['react-app']),
  rules: {
    ...common.rules,
    '@typescript-eslint/no-empty-interface': 1
  }
};
