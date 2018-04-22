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
  PLAY_VIDEO (state, payload) {
    state.current_video = payload
    state.player_active = true
  },
  STOP_VIDEO (state, payload) {
    state.currentVideo = {
      active: false,
      id: '',
      thumbnail: {
        width: '',
        height: '',
        url: ''
      }
    }
    state.player_active = false
  },
  SET_VIDEO_PLAYER_STATUS (state, payload) {
    state.player_active = payload
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
  TOGGLE_DRAWER (state, payload) {
    state.drawer = payload || !state.drawer
  },
  ACTIVATE_TYPING (state) {
    state.typing = true
  },
  DEACTIVATE_TYPING (state) {
    state.typing = false
  },
  ADD_DIALOG_NODE (state, payload) {
    state.captured_dialog.message.push(payload)
  },
  SET_CAPTURED_DIALOG (state, payload) {
    state.captured_dialog = payload
  },
  SET_CLASSIFICATION_TAGS (state, payload) {
    state.classification_tags = payload
  },
  SET_TAG_VALUE (state, payload) {
    state.classification_tags[payload.targer] = payload.value
  },
  SET_CONTENT_VIDEOS (state, payload) {
    state.content_videos = payload
  },
  SET_CONTENT_TEXTS (state, payload) {
    state.content_texts = payload
  },
  SET_CURRENT_TEXT (state, payload) {
    state.current_text = payload
  },
  SET_CURRENT_DIALOG (state, payload) {
    state.current_dialog = payload
  },
  SET_UNSEEN_DIALOGS (state, payload) {
    state.unseen_dialogs = payload
  },
  SET_PENDING_DIALOGS (state, payload) {
    state.pending_dialogs = payload
  },
  SET_FINISHED_DIALOGS (state, payload) {
    state.finished_dialogs = payload
  },
  SET_LOGIN_RETURN (state, payload) {
    state.login_return = payload
  },
  CLEAR_LOGIN_RETURN (state, payload) {
    state.login_return = null
  },
  SET_FEATURES (state, payload) {
    state.dashboard_features = payload
  },
  SET_SELECTED_FEATURE (state, payload) {
    state.dashboard_selected_feature = payload
  },
  SET_NEWSLETTER_SUBSCRIBERS (state, payload) {
    state.dashboard_newsletter_subscribers = payload
  },
  SET_DASHBOARD_SHARED_CONTENT (state, payload) {
    state.dashboard_shared_content = payload
  }
}
