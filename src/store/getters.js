export default {
    getItems(state) {
        console.log('getters', state.item)
        return state.item;
    },
    doneTodosCount: (state, getters) => {

        return state.todos.filter(todo => todo.done)
    }
}