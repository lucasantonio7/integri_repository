export default {
  getUser: state => {
    return state.user
  },
  getTrends: state => {
    return state.trends
  },
  displayChat: state => {
    return state.displayChat
  },
  getContext: state => {
    return state.context
  },
  getChat: state => {
    return state.chat
  },
  isTyping: state => {
    return state.typing
  }
}
