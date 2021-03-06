// 打包其他资源
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')

module.exports = {
	mode: 'development',
	entry: './src7/index.js',
	output: {
		filename: 'build.js',
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
			},
			{
				test: /\.(jpg|jpeg|png|gif)$/,
				loader: 'url-loader',
				options: {
					limit: 10 * 1024,
					name: '[hash:10].[ext]'
				}
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					// 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
					// 解析时会出问题：[object Module]
					esModule: false
				}
			},
			// // 不能随意添加（影响输出打包图片的地址问题）
			// // 打包其他资源(除了html/js/css资源以外的资源)
			// // 排除css/js/html资源
			// {
			// 	exclude: /\.(css|js|html|less)$/,
			// 	loader: 'file-loader',
			// 	options: {
			// 		name: '[hash:10].[ext]',
			// 	}
			// }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './src7/public/index.html' })
	]
}