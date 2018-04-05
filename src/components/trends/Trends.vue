<template>
  <v-container grid-list-md class="no-fixed-height">
    <v-layout row wrap>
      <v-flex xs12>
        <h6 class="trends-title title">Veja alguns vídeos que estão sendo assistidos</h6>
      </v-flex>
      <v-flex xs12 md3 v-for="video in videosTrends" :key="video.id">
        <youtube-video-component  :video="video" :showDescription="true"></youtube-video-component>
      </v-flex>
      <v-flex xs12 class="text-xs-right load-new">
        <a @click="showMore" v-if="display < allTrends">Ver mais</a>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios'
import YoutubeVideoComponent from '../yt-video-component/YoutubeVideoComponent'
export default {
  components: {YoutubeVideoComponent},
  data () {
    return {
      currentVideo: {
        active: false,
        id: '',
        thumbnail: {
          width: '',
          height: '',
          url: ''
        }
      },
      display: 0,
      showVideo: false
    }
  },
  mounted () {
    axios.get('/api/google/trends').then(response => {
      this.$store.commit('SET_TRENDS', response.data)
      this.display = this.$store.getters.getUser.login ? 8 : 4
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    videosTrends () {
      let count = 0
      return this.$store.getters.getTrends.filter(trend => {
        if (count < this.display) {
          count += 1
          return true
        }
      })
    },
    allTrends () {
      return this.$store.getters.getTrends.length
    }
  },
  methods: {
    ready (player) {
      this.player = player
    },
    playing (player) {
      // The player is playing a video.
    },
    showMore () {
      this.display += 4
    },
    playVideo (video) {
      this.$store.commit('PLAY_VIDEO', video)
    },
    closeModal () {
      this.player.stopVideo()
      this.showVideo = false
    }
  }
}
</script>
<style lang="sass">
  @import './Trends.scss'
</style>
