<template>
  <router-link v-show="!user.login" class="jorney-btn" :to="{ path:'/login' }">
    <i class="fa fa-user-o" aria-hidden="true"></i>
    <span class="text-piece">Inicie sua jornada!</span>
  </router-link>
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
