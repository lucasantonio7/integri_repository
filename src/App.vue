<template>
  <div id="app">
    <!-- vuetifyjs requires this v-app directive to work properly -->
    <v-app>
      <toolbar></toolbar>
      <home></home>
      <integri></integri>
    </v-app>
  </div>
</template>

<script>
  import Toolbar from './components/toolbar/Toolbar'
  import Home from './components/home/Home'
  import Integri from './components/integri/Integri'

  export default {
    name: 'app',
    components: {
      Toolbar,
      Home,
      Integri
    }
  }

</script>

<style lang="stylus">
  @import './stylus/main'

</style>
