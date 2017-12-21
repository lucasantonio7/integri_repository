
import axios from 'axios'
export default {
  LOGIN ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get('/api/twitter/user').then(response => {
        commit('SET_USER', {login: response.data.login, user_data: response.data.user, access_denied: response.data.denied})
        resolve(true)
      }).catch(err => {
        commit('SET_USER', {login: err.data.login, user_data: null, access_denied: err.data.denied})
        reject(false)
      })
    })
  }
}
