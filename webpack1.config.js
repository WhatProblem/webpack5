const path = require('path')
const ConsoleLogOnBuildWebpackPlugin = require('./myPlugin/myPlugin')

module.exports = {
	entry: {
		main: './src1/main.js'
	},
	output: {
		filename: '[name].[hash].js',
		path: __dirname + '/dist'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'myLoader'
			}
		]
	},
	plugins: [
		new ConsoleLogOnBuildWebpackPlugin()
	]
}