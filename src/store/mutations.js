export default {
  SET_USER (state, payload) {
    state.user = payload
  },
  SET_TRENDS (state, payload) {
    state.trends = payload
  },
  TOGGLE_CHAT_VISIBILITY (state, payload) {
    state.displayChat = !state.displayChat
  }
}
