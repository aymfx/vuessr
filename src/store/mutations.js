import Vue from 'vue'
export default {

    setItem(state, item) {
        // Vue.set(state.item, item[0])
        // console.log(item, "mutions")
        state.item = item[0];
    }
}