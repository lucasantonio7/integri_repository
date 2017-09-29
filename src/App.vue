<template>
  <div id="app">
    <!-- vuetifyjs requires this v-app directive to work properly -->
    <v-app>
      <main>
        <toolbar></toolbar>
        <home></home>
        <integri></integri>
        <trends></trends>
        <relevant></relevant>
        <share-social></share-social>
        <sponsors></sponsors>
      </main>
    </v-app>
  </div>
</template>

<script>
  import Toolbar from './components/toolbar/Toolbar'
  import Home from './components/home/Home'
  import Integri from './components/integri/Integri'
  import Trends from './components/trends/Trends'
  import Relevant from './components/relevant/Relevant'
  import ShareSocial from './components/share/ShareSocial'
  import Sponsors from './components/sponsors/Sponsors'

  export default {
    name: 'app',
    components: {
      Toolbar,
      Home,
      Integri,
      Trends,
      Relevant,
      ShareSocial,
      Sponsors
    }
  }

</script>

<style lang="stylus">
  @import './stylus/main'

</style>
