<template>
  <div id="app">
    <!-- vuetifyjs requires this v-app directive to work properly -->
    <v-app>
      <main>
        <toolbar></toolbar>
        <home></home>
        <integri></integri>
        <trends></trends>  
      </main>
    </v-app>
  </div>
</template>

<script>
  import Toolbar from './components/toolbar/Toolbar'
  import Home from './components/home/Home'
  import Integri from './components/integri/Integri'
  import Trends from './components/trends/Trends'

  export default {
    name: 'app',
    components: {
      Toolbar,
      Home,
      Integri,
      Trends
    }
  }

</script>

<style lang="stylus">
  @import './stylus/main'

</style>
