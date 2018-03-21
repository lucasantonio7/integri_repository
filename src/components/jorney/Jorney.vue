<template>
  <v-btn v-show="!user.login" dark color="purple" class="jorney-btn" large block :to="{ path:'/login' }">
    <v-icon left>fa fa-user-o</v-icon>
    <span left class="text-piece">Inicie sua jornada!</span>
  </v-btn>
</template>
<script>
export default {
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  mounted () {
    this.$store.dispatch('LOGIN')
  }
}
</script>
<style lang="scss" scoped>
  @import './Jorney.scss'
</style>
