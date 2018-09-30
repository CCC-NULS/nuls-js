const path = require('path');
const config = require('config');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const merge = require('webpack-merge');

const commonWebpackConfig = {
	entry: {
		'nuls-js': './src/index.ts'
	},
	output: {
		library: '@nuls/[name]',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.ts', '.js', '.json'],
		alias: {
			config: path.resolve(__dirname, './config/config.json'),
			'@': path.join(__dirname, './src')
		}
	},
	module: {
		rules: [
			{ test: /\.ts$/, use: 'ts-loader' }
		]
	}
};

const serverWebpackConfig = merge(commonWebpackConfig, {
	target: 'node',
	externals: [nodeExternals({
		whitelist: ['config']
	})],
	output: {
		libraryTarget: 'commonjs2',
		filename: '[name].cjs.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.browser': false
		})
	]
});

const clientWebpackConfig = merge(commonWebpackConfig, {
	target: 'web',
	output: {
		libraryTarget: 'umd',
		filename: '[name].umd.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.browser': true
		})
	]
});

module.exports = [serverWebpackConfig, clientWebpackConfig];
