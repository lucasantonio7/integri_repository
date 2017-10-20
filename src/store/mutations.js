export default {
  ADD_TEXT (state, payload) {
    state.chat.push(payload)
  },
  HIDE_CHAT_NOTIFICATION (state, payload) {
    state.displayChat.isNotificationActive = false
  },
  HIDE_CHAT_LABEL (state, payload) {
    state.displayLabel.isNotificationActive = false
  },
  SET_USER (state, payload) {
    state.user = payload
  },
  SET_TRENDS (state, payload) {
    state.trends = payload
  },
  SET_RELEVANT (state, payload) {
    state.relevant = payload
  },
  SET_CHAT_VISIBLE (state, payload) {
    state.displayChat.active = true
  },
  SHOW_CHAT_NOTIFICATION (state, payload) {
    state.displayChat.isNotificationActive = true
  },
  SET_CONTEXT (state, payload) {
    state.context = payload
  },
  TOGGLE_CHAT_VISIBILITY (state, payload) {
    state.displayChat.active = !state.displayChat.active
  },
  TOGGLE_TYPING (state) {
    state.typing = !state.typing
  }
}
