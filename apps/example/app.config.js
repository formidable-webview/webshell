const webshellVersion = require('@formidable-webview/webshell/package.json')
  .version;

export default {
  name: 'webshell-autoheight-example',
  displayName: 'Webshell Autoheight Example',
  expo: {
    githubUrl: 'https://github.com/formidable-webview/webshell',
    icon: './icon.png',
    name: '@formidable-webview/webshell Autoheight Example',
    slug: 'formidable-webview-autoheight-example',
    description: 'Autoheight example for @formidable-webview/webshell',
    privacy: 'public',
    version: webshellVersion,
    platforms: ['ios', 'android'],
    ios: {
      supportsTablet: true
    },
    assetBundlePatterns: ['**/*']
  }
};
