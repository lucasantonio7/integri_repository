<template>
  <div id="app">
    <!-- vuetifyjs requires this v-app directive to work properly -->
    <v-app toolbar footer>
      <toolbar></toolbar>
      <router-view></router-view>
      <router-view name="share"></router-view>
      <router-view name="sponsors"></router-view>
      <!-- <share-social></share-social> -->
      <video-viewer></video-viewer>
      <footerBar></footerBar>
    </v-app>
  </div>
</template>

<script>
  import Toolbar from './components/toolbar/Toolbar'
  import FooterBar from './components/footer/FooterBar'
  import VideoViewer from './components/video-viewer/VideoViewer'
  export default {
    name: 'app',
    components: {
      Toolbar,
      FooterBar,
      VideoViewer
    }
  }

</script>

<style lang="stylus">
  @import './stylus/main'
</style>
