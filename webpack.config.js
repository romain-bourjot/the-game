const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: './dist'
	},
	plugins: [
		new CopyWebpackPlugin([
			{from: './**/*', to: '.', context: './static'},
			{from: './**/*', to: '.', context: './assets'}
		])
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				use: ['base64-inline-loader']
			}
		]
	},
	resolve: {
		  extensions: ['*', '.js']
	}
};
