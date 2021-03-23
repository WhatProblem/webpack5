// html压缩
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { resolve } = require('path')

// 设置nodejs环境变量
// process.env.NODE_ENV = 'development'

module.exports = {
	target: process.env.NODE_ENV === 'production' ? 'browserslist' : 'web',
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
	entry: './src15/index.js',
	output: {
		filename: 'js/build.js',
		path: resolve(__dirname, 'build'),
		// 打包之前清理文件
		clean: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					/*
					js兼容性处理：安装babel-loader @babel/core 两个库
						1. 基本js兼容性处理 --> 安装@babel/preset-env库
							问题：只能转换基本语法，如promise高级语法不能转换
						2. 需要做兼容性处理的就做：按需加载  --> 安装core-js库并在presets里面作如下配置
					  
						前两步骤是我们常用的兼容性处理的方式
	
						3. 全部js兼容性处理 --> 安装babel-loader @babel/core @babel/preset-env @babel/polyfill  
						不需要进行配置，只需要在主入口文件中引入 @babel/polyfill即可（import '@babel/polyfill'）
							问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了，所以我们不使用这种方式~
				*/
					{
						loader: 'babel-loader',
						options: {
							// 预设：指示babel做怎么样的兼容性处理
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
							]
						}
					},
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
						loader: 'eslint-loader',
						options: {
							exclude: /node_modules/,
							// 自动修复代码错误
							fix: true
						}
					},
				]
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
			template: './src15/public/index.html',
			// 压缩html代码
			minify: {
				// 移除空格
				collapseWhitespace: true,
				// 移除注释
				removeComments: true
			}
		}),
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
						discardComments: { removeAll: true }
					}
				]
			}
		})
	],

	// js 文件压缩
	optimization: {
    // splitChunks: {
    //   chunks: 'all'
    //     // 默认值，可以不写，基本上不修改~
    //     /* minSize: 30 * 1024, // 分割的chunk最小为30kb，小于30kb的不分割，大于30kb才分割
    //     maxSiza: 0, // 最大没有限制
    //     minChunks: 1, // 要提取的chunk最少被引用1次
    //     maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量
    //     maxInitialRequests: 3, // 入口js文件最大并行请求数量
    //     automaticNameDelimiter: '~', // 名称连接符
    //     name: true, // 可以使用命名规则
    //     cacheGroups: {
    //       // 分割chunk的组
    //       // node_modules文件会被打包到 vendors 组的chunk中。--> vendors~xxx.js
    //       // 满足上面写的公共规则，如：大小超过30kb，至少被引用一次。
    //       vendors: {
    //         test: /[\\/]node_modules[\\/]/,
    //         // 优先级
    //         priority: -10
    //       },
    //       default: {
    //         // 要提取的chunk最少被引用2次
    //         minChunks: 2,
    //         // 优先级
    //         priority: -20,
    //         // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
    //         reuseExistingChunk: true
    //       } 
    //     }*/
    // },
    // // 将当前模块的记录其他模块的hash单独打包为一个文件 runtime
    // // 解决：修改a文件导致b文件的contenthash变化
    // runtimeChunk: {
    //   name: entrypoint => `runtime-${entrypoint.name}`
    // },
    minimizer: [
      // 配置生产环境的压缩方案：js和css
      new TerserWebpackPlugin({
				exclude: /node_modules/,
        // // 开启缓存
        // cache: true,
        // // 开启多进程打包
        // parallel: true,
        // // 启动source-map
        // sourceMap: true
      })
    ]
  }
}