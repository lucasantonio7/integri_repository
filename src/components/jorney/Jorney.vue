<template>
  <v-btn v-show="!user.login" dark class="jorney-btn" justify-start :class="{'fixed': fixed}" large block depressed :to="{ path:'/login' }">
    <v-icon left>far fa-user</v-icon>
    <span class="text-piece">Inicie sua jornada!</span>
  </v-btn>
</template>
<script>
export default {
  props: ['fixed'],
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  mounted () {
    this.$store.commit('SET_LOGIN_RETURN', '/home')
    this.$store.dispatch('LOGIN')
  }
}
</script>
<style lang="scss" scoped>
  @import './Jorney.scss'
</style>
