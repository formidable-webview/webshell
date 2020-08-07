module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:compat/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['lib/', 'types/'],
  overrides: [
    {
      files: ['src/**/*.webjs'],
      extends: ['eslint:recommended', 'plugin:compat/recommended'],
      parser: 'espree',
      parserOptions: { ecmaVersion: 5, sourceType: 'script' },
      env: {
        browser: true
      },
      rules: {
        'no-unused-vars': 0,
        strict: ['error', 'never'],
        '@typescript-eslint/no-unused-vars': 'off',
        'dot-notation': 'off',
        'compat/compat': ['error', 'Android >= 4.1, ChromeAndroid >= 0, iOS >= 8.0, UCAndroid >= 0']
      }
    }
  ],
  rules: {
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true }
    ],
    'no-eval': 'off'
  }
};
