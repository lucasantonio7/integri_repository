<template>
  <div class="homepage">
    <v-card-media :src="require('@/assets/jpg/home-min.jpeg')" height="553px" class="home-mask">
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
    <integri v-if="!getUser.login"></integri>
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
import { mapGetters } from 'vuex'
export default {
  components: {
    Jorney,
    Integri,
    Trends,
    Relevant,
    fcb
  },
  computed: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>
<style lang="sass">
  @import './Home.scss'
</style>
