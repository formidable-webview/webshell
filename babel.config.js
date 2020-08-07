module.exports = (api) => {
  let presets = ['@babel/typescript'];
  if (api.env('test')) {
    presets = ['module:metro-react-native-babel-preset', ...presets];
  }
  return {
    presets,
    plugins: [
      [
        'babel-plugin-inline-import',
        {
          extensions: ['.webjs']
        }
      ],
      '@babel/plugin-transform-react-jsx'
    ]
  };
};
