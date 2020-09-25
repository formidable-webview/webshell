module.exports = {
  root: true,
  extends: ['./.eslintrc.js'],
  overrides: [
    {
      files: ['*.webjs'],
      extends: '@formidable-webview/eslint-config-webjs'
    }
  ]
};
