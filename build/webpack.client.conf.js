/*
 * @Author: ly 
 * @Date: 2018-07-05 10:00:10 
 * @Last Modified by: ly
 * @Last Modified time: 2018-07-11 17:26:26
 * @description: {'客户端webpack编译'} 
 */

const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production';
module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: isProd ? false : 'inline-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[id].[chunkhash].js',
        publicPath: '/'
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"' // 增加process.env.VUE_ENV
        }),
        new webpack.optimize.SplitChunksPlugin({
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                //打包重复出现的代码
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial',
                    minChunks: 2, //(default: 1) 拆分前共享一个模块的最小块数
                    maxInitialRequests: 5, // (default 3) 一个入口最大并行请求数
                    minSize: 0, // (default: 30000) 块的最小大小
                    name: 'vendor'
                },
                //打包第三方类库
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: Infinity
                }
            }
        }),
        new webpack.optimize.RuntimeChunkPlugin({
            name: "manifest"
        }),
        // 此插件在输出目录中
        // 生成 `vue-ssr-client-manifest.json`。
        new VueSSRClientPlugin() //
    ]
})