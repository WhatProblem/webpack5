// 懒加载
// 懒加载需要配置好 eslint-loader 负责项目会报错
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
	// 单入口
	entry: './src18/index.js',
	output: {
		// [name]：取文件名
		filename: 'js/[name].[contenthash:10].js',
		path: resolve(__dirname, 'build'),
		clean: true
	},
	devServer: {
		contentBase: resolve(__dirname, 'build'),
		// 开启gzip压缩，打包后代码体积更小
		compress: true,
		port: 3000,
		open: true,
		hot: true
	},
	devtool: 'eval-source-map', // 生成映射文件
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				type: 'javascript/auto',
				options: {
					presets: [
						[
							'@babel/preset-env',
							{
								// 按需加载
								useBuiltIns: 'usage',
								// 制定core-js版本
								corejs: {
									version: 3
								},
								// 指定兼容性做到哪个版本浏览器
								targets: {
									chrome: '60',
									firefox: '60',
									ie: '9',
									safari: '10',
									edge: '17'
								}
							}
						]
					],
					// 开启babel缓存
					// 第二次构建时，会读取之前的缓存
					cacheDirectory: true // 本节修改的位置
				}
			},
			{
				test: /\.css$/,
				use: [
					// 'style-loader', 
					// 提出css到link标签中
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// 解决打包后css文件路径问题
							publicPath: '../'
						}
					},
					'css-loader',

					// // 使用loader的默认配置
					// // ‘postcss-loader’ 添加css兼容前缀
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									[
										"postcss-preset-env",
										{
											// 其他选项
										},
									],
								],
							},
						},
					},
				]
			},
			{
				test: /\.less$/,
				use: [
					// 'style-loader', 
					// 提出css到link标签中
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// 解决打包后css文件路径问题
							publicPath: '../'
						}
					},
					'css-loader',
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									[
										"postcss-preset-env",
										{
											// 其他选项
										},
									],
								],
							},
						},
					},
					'less-loader'
				]
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
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src18/public/index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true
			}
		}),
		new MiniCssExtractPlugin({
			// 重命名输入css文件
			filename: 'css/[name].[contenthash:10].css',
			chunkFilename: 'css/[id].[contenthash:10].css'
		}),
		// css 文件压缩，移除所有注释
		new CssMinimizerPlugin({
			minimizerOptions: {
				preset: [
					'default',
					{
						discardComments: { removeAll: true }
					}
				]
			}
		})
	],
	/*
		1. 单入口的这种形式经常使用，实现功能：单入口打包输出多个出口文件，从而使得多个文件并行运行，增加运行速度
		2. 这种方式可以将node_modules中代码单独打包一个chunk最终输出，将入口文件打包输出一个出口文件，如果想要将某个单独的文件也打包输出为一个文件，则需要进行以下配置：
			1. optimization配置
			2.在打包的出口文件中对需要单独打包的文件输入相关代码
	*/
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
	mode: 'production'
}