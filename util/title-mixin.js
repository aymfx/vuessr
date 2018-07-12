/*
 * @Author: ly 
 * @Date: 2018-07-12 14:19:15 
 * @Last Modified by: ly
 * @Last Modified time: 2018-07-12 14:42:02
 * @description: {'添加页面标题'}
 */

function getTitle(vm) {
    // 组件可以提供一个 `title` 选项
    // 此选项可以是一个字符串或函数
    const {
        title
    } = vm.$options
    if (title) {
        return typeof title === 'function' ?
            title.call(vm) :
            title
    }
}

const serverTitleMixin = {
    created() {
        const title = getTitle(this)

        if (title) {
            this.$ssrContext.title = title
        }
    }
}

const clientTitleMixin = {
    mounted() {
        const title = getTitle(this)
        if (title) {
            document.title = title
        } else {
            document.title = '懒人服务端渲染测试'
        }
    }
}

// 可以通过 `webpack.DefinePlugin` 注入 `VUE_ENV`
export default process.env.VUE_ENV === 'server' ?
    serverTitleMixin :
    clientTitleMixin