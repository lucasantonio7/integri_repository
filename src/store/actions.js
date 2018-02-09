import axios from 'axios'
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
  LOAD_CONTENT_VIDEOS ({ commit, state }) {
    axios('/api/google/videocontent').then(resp => {
      commit('SET_CONTENT_VIDEOS', resp.data)
    }).catch(err => {
      console.log(err)
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
  }
}
