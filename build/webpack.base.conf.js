/*
 * @Author: ly 
 * @Date: 2018-07-05 09:44:58 
 * @Last Modified by: ly
 * @Last Modified time: 2018-07-06 14:43:54
 * @description: {'webpack的通用的配置'} 
 */

const path = require("path"); //路径api
const VueLoaderPlugin = require("vue-loader/lib/plugin");

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
        filename: "static/js/[name].js",
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
    module: {
        rules: [{
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
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
    plugins: [new VueLoaderPlugin()]
};