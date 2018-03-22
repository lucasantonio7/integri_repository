<template>
  <v-btn v-show="!user.login" dark color="purple" class="jorney-btn" :class="{'fixed': fixed}" large block depressed :to="{ path:'/login' }">
    <v-icon left>fa fa-user-o</v-icon>
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
    this.$store.dispatch('LOGIN')
  }
}
</script>
<style lang="scss" scoped>
  @import './Jorney.scss'
</style>
