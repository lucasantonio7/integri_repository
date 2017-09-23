<template>
  <div v-show="!user.login" class="jorney-btn" @click="startLogin">
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
      this.$store.commit('SET_USER', {login: response.data.login, user_data: response.data.user})
    }).catch(err => {
      console.log(err)
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
