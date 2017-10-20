<template>
  <v-container grid-list-md class="no-fixed-height">
    <v-layout row wrap>
      <v-flex xs12>
        <h6 class="trends-title">Veja alguns vídeos que estão sendo assistidos</h6>
      </v-flex>
      <v-flex xs6 md3 v-for="video in videosTrends" :key="video.id">
        <youtube :video-id="video.id" player-width="215" player-height="146" class="responsive-yt"></youtube>
        <v-list two-line subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ video.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ video.channel }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12 class="text-xs-right load-new">
        <a @click="showMore" v-if="display < allTrends">Ver mais</a>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios'
export default {
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
    showMore () {
      this.display += 4
    }
  }
}
</script>
<style lang="sass">
  @import './Trends.scss'
</style>
