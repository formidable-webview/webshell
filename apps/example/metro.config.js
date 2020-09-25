const path = require('path');
const fs = require('fs');

const packagesRoot = path.resolve(__dirname, '../../packages');

const localPkgs = fs.readdirSync(packagesRoot);

module.exports = {
  projectRoot: __dirname,
  watchFolders: localPkgs.map((f) => path.join(packagesRoot, f)),
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'webjs', 'html'],
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(__dirname, `node_modules/${name}`)
      }
    )
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
