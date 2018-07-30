<template>
  <v-footer class="footerbar-integri" dark app absolute="">
    <span>Uma realização Parceiros Voluntários.</span>
    <v-spacer></v-spacer>
    <v-btn flat dark class="hidden-sm-and-down" :to="{ path: '/politicas/privacidade' }">Privacidade</v-btn>
    <v-btn flat dark class="hidden-sm-and-down" :to="{ path: '/politicas/uso' }">Termos de uso</v-btn>
    <v-icon class="hidden-md-and-up" @click="toggleDrawer">help</v-icon>
  </v-footer>
</template>
<script>
export default {
  methods: {
    toggleDrawer () {
      this.$store.commit('TOGGLE_DRAWER')
    }
  }
}
</script>

<style lang="sass">
  @import 'FooterBar.scss'
</style>
