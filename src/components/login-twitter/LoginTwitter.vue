<template>
  <div v-show="!user.login" class="jorney-btn" :to="{ path:'/login' }">
    <i class="fa fa-user-o" aria-hidden="true"></i>
    <span class="text-piece">Inicie sua jornada!</span>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  mounted () {
    axios.get('/api/twitter/user').then(response => {
      this.$store.commit('SET_USER', {login: response.data.login, user_data: response.data.user, access_denied: response.data.denied})
      // let categories = response.data.user.like
    }).catch(err => {
      this.$store.commit('SET_USER', {login: err.data.login, user_data: null, access_denied: err.data.denied})
    })
  },
  methods: {
    startLogin () {
      window.location.href = '/api/twitter/login'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'LoginTwitter.scss'
</style>
