const path = require('path');
const { getDefaultConfig } = require('metro-config');
const blacklist = require('metro-config/src/defaults/blacklist');

const root = path.resolve(__dirname, '..');
const modules = Object.keys({
  ...require('../package.json').peerDependencies
});

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(root, 'src')],
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'webjs', 'html']
  },
  transformer: {
    // extraNodeModules: [
    //   {
    //     '@formidable-webview/webshell': root
    //   }
    // ],
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  }
};

// module.exports = async () => {
//   const defaultConfig = await getDefaultConfig();
//   return {
//     projectRoot: __dirname,
//     watchFolders: [root],
//     resolver: {
//       sourceExts: defaultConfig.resolver.sourceExts.concat(['webjs', 'html']),
//       blacklistRE: blacklist(
//         modules.map(
//           (m) =>
//             new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
//         )
//       ),
//       extraNodeModules: modules.reduce(
//         (acc, name) => {
//           acc[name] = path.join(__dirname, 'node_modules', name);
//           return acc;
//         },
//         {
//           '@formidable-webview/webshell': root
//         }
//       ),
//       transformer: {
//         getTransformOptions: async () => ({
//           transform: {
//             experimentalImportSupport: false,
//             inlineRequires: true
//           }
//         })
//       }
//     }
//   };
//   //.then(() => Promise.reject(new Error('Prevent start')));
// };
