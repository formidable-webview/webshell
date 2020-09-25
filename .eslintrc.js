module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:compat/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  rules: {
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true }
    ],
    'no-eval': 'off'
  }
};
