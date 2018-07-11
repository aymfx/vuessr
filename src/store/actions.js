import {
    getItem
} from '../api'
export default {
    fetchItem({
        commit
    }) {
        // 以便我们能够知道数据在何时更新
        return getItem().then(item => {
            console.log('actions', item)
            commit('setItem', item)
        })
    }
}