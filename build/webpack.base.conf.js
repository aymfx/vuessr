/*
 * @Author: ly 
 * @Date: 2018-07-05 09:44:58 
 * @Last Modified by: ly
 * @Last Modified time: 2018-07-12 14:14:57
 * @description: {'webpack的通用的配置'} 
 */

const path = require("path"); //路径api
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    context: path.resolve(__dirname, "../"),
    target: "web",
    entry: {
        app: "./src/entry-client.js"
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "static/js/[hash:8].js",
        chunkFilename: 'static/js/[id].[chunkhash].js',
        publicPath: "/"
    },
    resolve: { //解析，对一些操作更加方便快捷
        extensions: [".js", ".vue", ".json"], //自动解决某些扩展名 便于webpack识别
        alias: { //为一些路径添加别名
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src")
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        } //SplitChunks允许我们将公共依赖项提取到现有的块或全新的块中
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    extractCSS: isProd
                }
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.scss/,
                use: isProd ? ExtractTextPlugin.extract({
                    use: [{
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        'sass-loader'
                    ],
                    fallback: 'vue-style-loader'
                }): ['vue-style-loader', 'css-loader']
            }, {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/webpack-dev-server/client")
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "img/[name].[hash:7].[ext]"
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "media/[name].[hash:7].[ext]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "fonts/[name].[hash:7].[ext]"
                }
            }
        ]
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
    }, //性能提示
    plugins: [
        new VueLoaderPlugin(),
        new ExtractTextPlugin({
            filename: 'static/css/common.[chunkhash].css',
            allChunks: true,
        }), //抽离css文件
        new webpack.HashedModuleIdsPlugin(), //保留未修改代码的hashid模块，利于缓存
    ]
};