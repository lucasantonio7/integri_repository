<template>
  <v-container grid-list-md class="no-fixed-height">
    <v-layout row wrap>
      <v-flex xs12>
        <h6 class="trends-title title">Veja alguns vídeos que estão sendo assistidos</h6>
      </v-flex>
      <v-flex xs12 md3 v-for="video in videosTrends" :key="video.id" @click="playVideo(video)">
        <div class="thumbnail">
          <img :src="video.thumbnail.url" :alt="video.title">
        </div>
        <v-list two-line subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ video.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ video.channel }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-dialog v-model="showVideo" persistent :max-width="currentVideo.thumbnail.width" :width="currentVideo.thumbnail.width">
        <div class="floating-video">
          <span class="close-btn" @click="closeModal"><i class="fa fa-chevron-left" aria-hidden="true"></i>Voltar</span>
          <youtube :video-id="currentVideo.id" :player-vars="{ autoplay: 1 }" :player-width="currentVideo.thumbnail.width" :player-height="currentVideo.thumbnail.height" class="responsive-yt" @ready="ready" @playing="playing"></youtube>
        </div>
      </v-dialog>
      <v-flex xs12 class="text-xs-right load-new">
        <a @click="showMore" v-if="display < allTrends">Ver mais</a>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios'
export default {
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
      showVideo: false
    }
  },
  mounted () {
    axios.get('/api/google/trends').then(response => {
      this.$store.commit('SET_TRENDS', response.data)
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    display () {
      return this.$store.getters.getUser.login ? 8 : 4
    },
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
