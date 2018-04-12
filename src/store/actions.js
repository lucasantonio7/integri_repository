import axios from 'axios'
// import { normalize, schema } from 'normalizr'
export default {
  LOGIN ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/twitter/user').then(response => {
        commit('SET_USER', {
          login: response.data.login,
          user_data: response.data.user,
          access_denied: response.data.denied
        })
        resolve(true)
      }).catch(err => {
        commit('SET_USER', {
          login: err.data.login,
          user_data: null,
          access_denied: err.data.denied
        })
        reject(false)
      })
    })
  },
  GET_FINISHED_DIALOGS ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/curatorship/dialogs', {
        params: {
          type: 'finished'
        }
      }).then(res => {
        commit('SET_FINISHED_DIALOGS', res.data)
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GET_PENDING_DIALOGS ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/curatorship/dialogs', {
        params: {
          type: 'pending'
        }
      }).then(res => {
        commit('SET_PENDING_DIALOGS', res.data)
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GET_UNSEEN_DIALOGS ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/curatorship/dialogs').then(res => {
        console.log(res)
        commit('SET_UNSEEN_DIALOGS', res.data)
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GET_TEXT_DATA ({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      axios.get('/api/texts/txt/' + id).then(res => {
        console.log(res.data)
        commit('SET_CURRENT_TEXT', res.data)
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GET_VIDEO ({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      axios.get('/api/google/video/' + id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  LOAD_CLASSIFICATION_TAGS ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios('/api/sources/classificationtags').then(resp => {
        resp.data.tags.forEach(tag => {
          tag.value = 50
        })
        resolve(true)
        commit('SET_CLASSIFICATION_TAGS', resp.data.tags)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  LOAD_CONTENT_VIDEOS ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios('/api/google/videocontent').then(resp => {
        commit('SET_CONTENT_VIDEOS', resp.data)
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  LOAD_CONTENT_TEXTS ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios('/api/texts/content').then(resp => {
        commit('SET_CONTENT_TEXTS', resp.data)
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  LOAD_FEATURES ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios('/api/dashboard/features').then(res => {
        commit('SET_FEATURES', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  LOAD_STATES ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/sources/places').then(resp => {
        commit('SET_STATES', resp.data.estados)
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CONTENT_SHARE ({ commit, state }, content) {
    return new Promise((resolve, reject) => {
      axios.post('/api/external/shared', content).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  SUBSCRIBE_NEWSLETTER ({ commit, state }, email) {
    return new Promise((resolve, reject) => {
      axios.post('/api/newsletter/subscribe', {email}).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GET_NEWSLETTER_SUBSCRIPTIONS ({ commit, state }, email) {
    return new Promise((resolve, reject) => {
      axios.get('/api/newsletter/subscriptions').then(res => {
        commit('SET_NEWSLETTER_SUBSCRIBERS', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  DASHBOARD_GET_CONTENT ({ commit, state }, source) {
    return new Promise((resolve, reject) => {
      axios.get('', {source}).then(resp => {
        console.log(resp)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
