const path = require('path');
const config = require('config');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const merge = require('webpack-merge');
const fs = require('fs');

const packageconfigFileName = './config/config.json';
const packageconfigPath = path.resolve(__dirname, packageconfigFileName);

fs.writeFileSync(packageconfigPath, JSON.stringify(config));

const commonWebpackConfig = {
	entry: {
		'nuls-js': './src/index.ts'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.txt$/,
				use: 'raw-loader'
			}
		]
	},
	node: {
		fs: 'empty',
		crypto: true,
		module: false
	},
	resolve: {
		extensions: ['.ts', '.js', '.txt'],
		alias: {
			config: path.resolve(__dirname, './config/config.json'),
			'@': path.join(__dirname, './src')
		}
	},
	output: {
		library: '@nuls/[name]',
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
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
