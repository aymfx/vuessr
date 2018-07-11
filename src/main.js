// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {
  sync
}
from 'vuex-router-sync' //将vue-router的当前$route同步为vuex store的状态的一部分
import {
  createRouter
} from './router'
import {
  createStore
} from './store'

Vue.config.productionTip = false

/* eslint-disable */
export function createApp() {
  // 创建 router 实例
  const router = new createRouter()
  //创建stroe 实例
  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  const app = new Vue({
    // 注入 router 到根 Vue 实例
    router,
    // 注入 store 到根 Vue 实例
    store,
    render: h => h(App)
  })
  // 返回 app 和 router
  return {
    app,
    router,
    store
  }
}