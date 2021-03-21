// 压缩css
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { resolve } = require('path')

// 设置nodejs环境变量
// process.env.NODE_ENV = 'development'

module.exports = {
	mode: 'development',
	// mode: 'production',
	devServer: {
		contentBase: resolve(__dirname, 'build'),
		// 开启gzip压缩，打包后代码体积更小
		compress: true,
		port: 3000,
		open: true,
		hot: true
	},
	entry: './src11/index.js',
	output: {
		filename: 'js/build.js',
		path: resolve(__dirname, 'build'),
		// 打包之前清理文件
		clean: true
	},
	module: {
		rules: [
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
					/*
					css兼容性处理：postcss --> postcss-loader postcss-preset-env（作用：postcss-preset-env帮助postcss识别环境从而加载对应的配置，从而使得代码兼容每一个浏览器的版本）

				 postcss-preset-env： 帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式

					//browserslist要写在package.json中
					"browserslist": {
						// 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
						"development": [
							"last 1 chrome version",//兼容最近的版本
							"last 1 firefox version",
							"last 1 safari version"
						],
						// 生产环境：默认是看生产环境
						"production": [
							">0.2%",
							"not dead",//不用已经死的浏览器
							"not op_mini all"//不用op_mini版本的浏览器
						]
					}
				*/

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
		new HtmlWebpackPlugin({ template: './src11/public/index.html' }),
		new MiniCssExtractPlugin({
			// 重命名输入css文件
			filename: 'css/[name].[contenthash].css',
			chunkFilename: 'css/[id].[contenthash].css'
		}),
		// css 文件压缩，移除所有注释
		new CssMinimizerPlugin({
			minimizerOptions: {
				preset: [
					'default',
					{
						discardComments: {removeAll: true}
					}
				]
			}
		})
	]
}