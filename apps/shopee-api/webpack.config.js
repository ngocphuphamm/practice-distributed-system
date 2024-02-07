const { NxWebpackPlugin } = require('@nx/webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {

  output: {
    path: path.join(__dirname, '../../dist/apps/shopee-api'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
    }),
    new CopyPlugin({
      patterns: [{ from: `${path.resolve(__dirname)}/routes-config`, to: 'routes-config' }],
    }),
  ],
};
