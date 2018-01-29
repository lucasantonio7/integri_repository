<template>
  <v-footer class="footerbar-integri" dark app>
    <span>Uma realização Parceiros Voluntários.</span>
    <v-spacer></v-spacer>
    <v-btn flat dark :to="{ path: '/politicas/privacidade' }">Privacidade</v-btn>
    <v-btn flat dark :to="{ path: '/politicas/uso' }">Termos de uso</v-btn>
  </v-footer>
</template>
<style lang="sass">
  @import 'FooterBar.scss'
</style>
