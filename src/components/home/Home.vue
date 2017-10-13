<template>
  <div class="homepage">
    <v-card-media :src="require('@/assets/png/home/integri_background.png')" height="553px">
      <v-container fill-height fluid>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 justify-center class="home-middle-container">
            <img :src="require('@/assets/svg/home/Integri_circle.svg')" alt="">
            <jorney class="home-middle-btn" v-ripple></jorney>
          </v-flex>
          <fcb></fcb>
        </v-layout>
      </v-container>
    </v-card-media>
    <integri></integri>
    <trends></trends>
    <relevant></relevant>
  </div>
</template>

<script>
import Jorney from '../jorney/Jorney'
import Integri from '../integri/Integri'
import Trends from '../trends/Trends'
import Relevant from '../relevant/Relevant'
import fcb from '../floating-chat-btn/FCB'
export default {
  components: {
    Jorney,
    Integri,
    Trends,
    Relevant,
    fcb
  }
}
</script>
<style lang="sass">
  @import './Home.scss'
</style>
