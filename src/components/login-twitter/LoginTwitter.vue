<template>
  <div>
    <a href="/api/twitter/login" v-if="!login">Login com twitter</a>
    <h2 v-if="login">Bem vindo! {{ user.displayName }}</h2>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    // May we should consider using VUEX
    return {
      login: false,
      user: {}
    }
  },
  mounted () {
    axios.get('/api/twitter/user').then(response => {
      this.login = response.data.login
      this.user = response.data.user
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>
<style lang="scss" scoped>
@import 'LoginTwitter.scss'
</style>
