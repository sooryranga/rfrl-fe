const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

console.error('test');

module.exports = {
  configureWebpack: {
    module: {
      rules: [{
        test: /\.ttf$/,
        use: ['file-loader'],
      }],
    },
    plugins: [
      new MonacoWebpackPlugin(),
    ],
  },
};
