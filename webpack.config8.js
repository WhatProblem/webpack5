// 创建devser 开发环境
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')

module.exports = {
	mode: 'development',
	devServer: {
		contentBase: resolve(__dirname, 'build'),
		// 开启gzip压缩，打包后代码体积更小
		compress: true,
		port: 3000,
		open: true
	},
	entry: './src8/index.js',
	output: {
		filename: 'js/build.js',
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
					name: '[hash:10].[ext]',
					outputPath: 'imgs'
				}
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					// 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
					// 解析时会出问题：[object Module]
					esModule: false,
				}
			},
			// 打包其他资源(除了html/js/css资源以外的资源)
			// 排除css/js/html资源
			// {
			// 	exclude: /\.(css|js|html|less)$/,
			// 	loader: 'file-loader',
			// 	options: {
			// 		name: '[hash:10].[ext]',
			// 		outputPath: 'media',
			// 		// esModule: false,
			// 	}
			// }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './src8/public/index.html' })
	]
}