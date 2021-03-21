// js 语法检查
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
	entry: './src12/index.js',
	output: {
		filename: 'js/build.js',
		path: resolve(__dirname, 'build'),
		// 打包之前清理文件
		clean: true
	},
	module: {
		rules: [
			/*
        语法检查： eslint-loader  eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          设置检查规则：
            package.json中eslintConfig中设置~
              "eslintConfig": {
                "extends": "airbnb-base"
              }
            airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
      */
			{
				test: /\.js$/,
				exclude: /node_modules/, // 排除第三方代码，只检查自己的代码
				loader: 'eslint-loader',
				options: {
					// 自动修复代码错误
					fix: true
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
		new HtmlWebpackPlugin({ template: './src12/public/index.html' }),
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