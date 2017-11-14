<template>
  <div id="app">
    <!-- vuetifyjs requires this v-app directive to work properly -->
    <v-app>
      <main>
        <toolbar></toolbar>
        <router-view></router-view>
        <router-view name="share"></router-view>
        <router-view name="sponsors"></router-view>
        <!-- <share-social></share-social> -->
        <FooterBar></FooterBar>
      </main>
    </v-app>
  </div>
</template>

<script>
  import Toolbar from './components/toolbar/Toolbar'
  import FooterBar from './components/footer/FooterBar'
  export default {
    name: 'app',
    components: {
      Toolbar,
      FooterBar
    }
  }

</script>

<style lang="stylus">
  @import './stylus/main'
</style>
