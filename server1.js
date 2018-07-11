/*
 * @Author: ly 
 * @Date: 2018-07-05 10:01:44 
 * @Last Modified by: ly
 * @Last Modified time: 2018-07-06 10:37:54
 * @description: {'koa服务器配置'} 
 */

const Koa = require('koa')
const app = new Koa()
const fs = require('fs')
const path = require('path')
const {
    createBundleRenderer
} = require('vue-server-renderer')
const LRU = require('lru-cache')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production';




const WebpackDev = require('./build/webpack.dev.conf');

app.use(require('koa-static')(resolve('./dist')))


let renderer;
let readyPromise;
const templatePath = resolve('./src/index.template.html')




function createRenderer(bundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, Object.assign(options, {
        // for component caching
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        // this is only needed when vue-server-renderer is npm-linked
        basedir: resolve('./dist'),
        // recommended for performance 推荐
        runInNewContext: false
    }))
}


/* // 生成服务端渲染函数
renderer = createBundleRenderer(serverBundle, {
    // 推荐
    runInNewContext: false,
    // 模板html文件
    template,
    // client manifest
    clientManifest
}) */


if (isProd) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(serverBundle, {
        // 模板html文件
        template,
        // client manifest
        clientManifest
    })
} else {
    readyPromise = WebpackDev(app, templatePath, (bundle, options) => {
        renderer = createRenderer(bundle, options)
    })
}




function clientRender(ctx, next) {
    // 设置请求头
    ctx.set('Content-Type', 'text/html')
    ctx.set('Server', 'Koa2 server side render')

    const context = {
        title: '服务端渲染测试',
        url: ctx.url
    };
    // 将服务器端渲染好的html返回给客户端
    ctx.body = renderToString(context);
}

function renderToString(context) {
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            err ? reject(err) : resolve(html)
        })
    })
}


//渲染页面，反应请求
app.use(async (ctx, next) => {

    try {
        isProd ? clientRender.bind(ctx, next) : (ctx, next) => {
            readyPromise.then(() => render(ctx, next))
        }
    } catch (e) {
        // 如果没找到，放过请求，继续运行后面的中间件
        next()
    }
})

app.listen(3000)