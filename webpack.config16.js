// sourceMap oneOf 缓存
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
	devtool: 'eval-source-map', // 生成映射文件
	devServer: {
		contentBase: resolve(__dirname, 'build'),
		// 开启gzip压缩，打包后代码体积更小
		compress: true,
		port: 3000,
		open: true,
		hot: true
	},
	entry: './src16/index.js',
	output: {
		filename: 'js/build.js',
		path: resolve(__dirname, 'build'),
		// 打包之前清理文件
		clean: true
	},
	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	use: [
			// 		/*
			// 		js兼容性处理：安装babel-loader @babel/core 两个库
			// 			1. 基本js兼容性处理 --> 安装@babel/preset-env库
			// 				问题：只能转换基本语法，如promise高级语法不能转换
			// 			2. 需要做兼容性处理的就做：按需加载  --> 安装core-js库并在presets里面作如下配置

			// 			前两步骤是我们常用的兼容性处理的方式

			// 			3. 全部js兼容性处理 --> 安装babel-loader @babel/core @babel/preset-env @babel/polyfill  
			// 			不需要进行配置，只需要在主入口文件中引入 @babel/polyfill即可（import '@babel/polyfill'）
			// 				问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了，所以我们不使用这种方式~
			// 	*/
			// 		{
			// 			loader: 'babel-loader',
			// 			options: {
			// 				// 预设：指示babel做怎么样的兼容性处理
			// 				presets: [
			// 					[
			// 						'@babel/preset-env',
			// 						{
			// 							// 按需加载
			// 							useBuiltIns: 'usage',
			// 							// 制定core-js版本
			// 							corejs: {
			// 								version: 3
			// 							},
			// 							// 指定兼容性做到哪个版本浏览器
			// 							targets: {
			// 								chrome: '60',
			// 								firefox: '60',
			// 								ie: '9',
			// 								safari: '10',
			// 								edge: '17'
			// 							}
			// 						}
			// 					]
			// 				]
			// 			}
			// 		},
			// 		/*
			// 			语法检查： eslint-loader  eslint
			// 			注意：只检查自己写的源代码，第三方的库是不用检查的
			// 			设置检查规则：
			// 				package.json中eslintConfig中设置~
			// 					"eslintConfig": {
			// 						"extends": "airbnb-base"
			// 					}
			// 				airbnb --> eslint-config-airbnb-base  eslint-plugin-import eslint
			// 		*/
			// 		{
			// 			loader: 'eslint-loader',
			// 			options: {
			// 				exclude: /node_modules/,
			// 				// 自动修复代码错误
			// 				fix: true
			// 			}
			// 		},
			// 	]
			// },

			// js 文件处理 
			{
				test: /\.js$/,
				exclude: /node_modules/,
				// 优先执行代码检查
				enforce: 'pre',
				loader: 'eslint-loader',
				options: {
					fix: true
				}
			},
			{
				oneOf: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
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
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src16/public/index.html',
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




/*
	缓存：
		1. babel缓存
			cacheDirectory: true
			--> 让第二次打包构建速度更快
		2. 文件资源缓存
			hash: 每次wepack构建时会生成一个唯一的hash值。
				问题: 因为js和css同时使用一个hash值。
					如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
			chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
				问题: js和css的hash值还是一样的
					因为css是在js中被引入的，所以同属于一个chunk
			contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样
			--> 让代码上线运行缓存更好使用（上线代码的性能优化的）

		综上所述：开启缓存需要经历两个步骤：
			1. 设置cacheDirectory: true
			2. 在输出的数组中加上contenthash
*/





/*
	source-map: 一种 提供源代码到构建后代码映射 技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）

		[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

		source-map：外部
			错误代码准确信息 和 源代码的错误位置
		inline-source-map：内联
			只生成一个内联source-map
			错误代码准确信息 和 源代码的错误位置
		hidden-source-map：外部
			错误代码错误原因，但是没有错误位置
			不能追踪源代码错误，只能提示到构建后代码的错误位置
		eval-source-map：内联
			每一个文件都生成对应的source-map，都在eval
			错误代码准确信息 和 源代码的错误位置
		nosources-source-map：外部
			错误代码准确信息, 但是没有任何源代码信息
		cheap-source-map：外部
			错误代码准确信息 和 源代码的错误位置
			只能精确的行
		cheap-module-source-map：外部
			错误代码准确信息 和 源代码的错误位置
			module会将loader的source map加入

		内联 和 外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

		开发环境：速度快，调试更友好
			速度快(eval>inline>cheap>...)
				eval-cheap-souce-map（速度最快）
				eval-source-map
			调试更友好
				souce-map（调试最好）
				cheap-module-souce-map
				cheap-souce-map

			--> eval-source-map  > ：eval-cheap-module-souce-map

		生产环境：源代码要不要隐藏? 调试要不要更友好
			内联会让代码体积变大，所以在生产环境不用内联
			nosources-source-map 全部隐藏
			hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

			--> source-map（） / cheap-module-souce-map
			最终总结：
				开发环境使用：eval-source-map
				生产环境使用：source-map（）
*/
