/*
 * @Author: ly 
 * @Date: 2018-07-05 10:01:44 
 * @Last Modified by: ly
 * @Last Modified time: 2018-07-06 16:45:05
 * @description: {'服务器配置'} 
 */
const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache') //组件缓存
const express = require('express')
const favicon = require('serve-favicon') //
const compression = require('compression')
const microcache = require('route-cache')
const {
    createBundleRenderer
} = require('vue-server-renderer')

const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000
const resolve = file => path.resolve(__dirname, file)
const serverInfo =
    `express/${require('express/package.json').version} ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`; //express服务器版本号以及vue-server-renderer版本号

const app = express()

/**
 * 创建一个render函数
 *
 * @param {*} bundle
 * @param {*} options
 * @returns
 */
function createRenderer(bundle, options) {
    // https://ssr.vuejs.org/zh/api/#runinnewcontext  方法介绍
    return createBundleRenderer(bundle, Object.assign(options, {
        // 使用组件缓存
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        // 显式地声明 server bundle 的运行目录，vue-server-renderer 是通过 NPM link 链接到当前项目中时，才需要配置此选项
        basedir: resolve('./dist'),
        // 对于每次渲染，bundle renderer 将创建一个新的 V8 上下文并重新执行整个 bundle,禁用最好
        runInNewContext: false
    }))
}

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')
if (isProd) {
    // 在生产中：使用模板和构建服务器束创建服务器渲染器。
    //vue-ssr-webpack-plugin创建 server bundle
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require('./dist/vue-ssr-server-bundle.json')
    // client manifest 是可选的，但是它允许被渲染
    // 自动预取链接并直接添加<script>
    // 在呈现期间使用的任何异步块的标记，避免瀑布请求
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
        template,
        clientManifest
    })
} else {
    // 在开发环境中，使用watch and hot-reload,
    // 更新新新的包和模板.
    readyPromise = require('./build/webpack.dev.conf')(
        app,
        templatePath,
        (bundle, options) => {
            renderer = createRenderer(bundle, options)
        }
    )
}

const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

//开启网站压缩功能
app.use(compression({
    threshold: 0
}))

//设置静态目录
app.use(serve('./dist', true))


//设置请求的favicon

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//每个请求微缓存一秒
app.use(microcache.cacheSeconds(1))


// 生产环境的数据的渲染
function render(req, res) {
    const s = Date.now()
    res.setHeader("Content-Type", "text/html")
    res.setHeader("Server", serverInfo)

    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('页面开小差了,可能路径不对哦')
        } else {
            // Render Error Page or Redirect
            res.status(500).send('服务器出小差了,程序员小哥哥正在修复~~')
            console.error(`渲染错误 : ${req.url},时间:${s.toString()}`)
            console.error(err.stack)
        }
    }

    const context = {
        title: '服务端渲染测试', // 设置title
        content: '插入meta标签测试',
        url: req.url
    }
    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err)
        }
        res.send(html)
        if (isProd) {
            console.log(`整个请求时间: ${Date.now() - s}ms`)
        }
    })
}

app.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req, res))
})


app.listen(port, () => {
    console.log(`服务器已经运行在 localhost:${port}`)
})