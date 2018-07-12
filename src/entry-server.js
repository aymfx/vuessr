import {
  createApp
} from './main'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const {
      app,
      router,
      store
    } = createApp()

    const {
      url
    } = context
    const {
      fullPath
    } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({
        url: fullPath
      })
    }

    router.push(url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        return reject({
          code: 404
        })
      }
      //如果组件中存在asyncData预处理的函数，我们先调用这个方法
      Promise.all(matchedComponents.map(({
        asyncData
      }) => asyncData && asyncData({
        store,
        route: router.currentRoute
      }))).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state
        // 数据的获取时间打印
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}