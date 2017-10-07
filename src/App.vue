<template>
  <div id="app">
    <!-- vuetifyjs requires this v-app directive to work properly -->
    <v-app>
      <main>
        <v-content>
          <toolbar></toolbar>
          <router-view></router-view>
          <share-social></share-social>
          <sponsors></sponsors>
        </v-content>
      </main>
    </v-app>
  </div>
</template>

<script>
  import Toolbar from './components/toolbar/Toolbar'
  import ShareSocial from './components/share/ShareSocial'
  import Sponsors from './components/sponsors/Sponsors'

  export default {
    name: 'app',
    components: {
      Toolbar,
      ShareSocial,
      Sponsors
    }
  }

</script>

<style lang="stylus">
  @import './stylus/main'

</style>
