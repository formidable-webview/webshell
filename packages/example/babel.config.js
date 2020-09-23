module.exports = function (api) {
  api.cache(false); // Otherwise, inline imports won't be recomputed.

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver'],
      [
        'babel-plugin-inline-import',
        {
          extensions: ['html', 'webjs']
        }
      ]
    ]
  };
};
