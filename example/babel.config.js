const path = require('path');
const pak = require('../package.json');

module.exports = function (api) {
  api.cache(false); // Otherwise, inline imports won't be recomputed.

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // For development, we want to alias the library to the source
            [pak.name]: path.join(__dirname, '..', pak.source)
          }
        }
      ],
      [
        'babel-plugin-inline-import',
        {
          extensions: ['html', 'webjs']
        }
      ]
    ]
  };
};
