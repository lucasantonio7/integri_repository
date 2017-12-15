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
  SET_STATES (state, payload) {
    state.states_cities = payload
  },
  SET_TRENDS (state, payload) {
    state.trends = payload
  },
  SET_RELEVANT (state, payload) {
    state.relevant = payload
  },
  SET_OPPORTUNITIES (state, payload) {
    state.opportunities = payload
  },
  SET_CHAT_VISIBLE (state, payload) {
    state.displayChat.active = true
  },
  SHOW_CHAT_NOTIFICATION (state, payload) {
    state.displayChat.isNotificationActive = true
  },
  SET_CAUSES (state, payload) {
    state.causes = payload
  },
  SET_SKILLS (state, payload) {
    state.skills = payload
  },
  SET_CONTEXT (state, payload) {
    state.context = payload
  },
  SET_POLICY (state, payload) {
    state.policy = payload
  },
  SET_USAGE_TERMS (state, payload) {
    state.usage_terms = payload
  },
  SET_ACCESS_SOURCE (state, payload) {
    state.access_source = payload
  },
  TOGGLE_CHAT_VISIBILITY (state, payload) {
    state.displayChat.active = !state.displayChat.active
  },
  TOGGLE_TYPING (state) {
    state.typing = !state.typing
  }
}
