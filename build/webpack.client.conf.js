/*
 * @Author: ly 
 * @Date: 2018-07-05 10:00:10 
 * @Last Modified by: ly
 * @Last Modified time: 2018-07-11 15:24:00
 * @description: {'客户端webpack编译'} 
 */

const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const webpack = require('webpack')

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: 'inline-source-map',
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
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                //打包重复出现的代码
                vendor: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0, // This is example is too small to create commons chunks
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