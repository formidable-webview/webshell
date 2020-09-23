const path = require('path');

const root = path.resolve(__dirname, '../core');

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(root, 'src')],
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'webjs', 'html']
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  }
};
