const path = require('path');
const config = require('config')
const fs = require('fs')
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
var merge = require('webpack-merge');

const packageConfigPath = path.resolve(__dirname, './config/config.json');
fs.writeFileSync(packageConfigPath, JSON.stringify(config))

const commonWebpackConfig = {
  entry: {
    'nuls-js': './src/index.ts'
  },
  output: {
    library: '@nuls/[name]',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      'config': packageConfigPath
    }
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};

var serverWebpackConfig = merge(commonWebpackConfig, {
  target: 'node',
  externals: [nodeExternals({
    whitelist: ['config']
  })],
  output: {
    libraryTarget: 'commonjs2',
    filename: '[name].cjs.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': false,
    })
  ]
});

var clientWebpackConfig = merge(commonWebpackConfig, {
  target: 'web',
  output: {
    libraryTarget: 'umd',
    filename: '[name].umd.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': true,
    })
  ]
});

module.exports = [serverWebpackConfig, clientWebpackConfig];