<template>
  <v-footer class="pa-3 footerbar-integri" dark app>
    <v-spacer></v-spacer>
    <v-btn flat dark :to="{ path: '/politicas/privacidade' }">Privacidade</v-btn>
    <v-btn flat dark :to="{ path: '/politicas/uso' }">Termos de uso</v-btn>
  </v-footer>
</template>
<style lang="sass">
  @import 'FooterBar.scss'
</style>
