import Vue from 'vue'
import Router from 'vue-router'
import about from '@/pages/about/about.vue'

const HelloWorld = () =>
  import ('@/components/HelloWorld')

Vue.use(Router)

export function createRouter() {  
  return new Router({
    mode: 'history',
    routes: [{
      path: '/',
      name: 'Hello',
      component: HelloWorld
    }, {
      path: '/about',
      name: 'About',
      component: about
    }]
  })
}