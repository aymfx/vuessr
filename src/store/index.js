import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore() {
    return new Vuex.Store({
        state: {
            item: '1212',
            user: {},
            todos: [{
                    id: 1,
                    text: '...',
                    done: true
                },
                {
                    id: 2,
                    text: '...',
                    done: false
                }
            ]
        },
        actions,
        mutations,
        getters
    })
}