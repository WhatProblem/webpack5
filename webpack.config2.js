// 基础配置

const {resolve} = require('path')

module.exports = {
    entry: './src2/index.js',
    output: {
        filename: './build.js',
        path: resolve(__dirname, 'build')
    },
    mode: 'development'
}