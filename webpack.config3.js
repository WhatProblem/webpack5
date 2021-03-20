// 打包样式资源

const { resolve } = require('path')

module.exports = {
	mode: 'development',
	entry: './src3/index.js',
	output: {
		filename: './build.js',
		path: resolve(__dirname, 'build')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader']
			}
		]
	},
	plugins: []
}