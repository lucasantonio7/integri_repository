<template>
  <div class="relevant-wrapper">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h6 class="relevant-title">Relevantes para você</h6>
        </v-flex>
        <v-flex xs12 md4 lg3 v-for="(video, index) in relevantVideos" :key="index">
          <youtube :video-id="video" class="responsive-yt"></youtube>
        </v-flex>
        <v-flex xs12 class="text-xs-right">
          <a @click="showMore" v-if="display < allVideos">Ver mais</a>
        </v-flex>
        <v-flex>
          <button @click="loadVideos">La bicicleta</button>
        </v-flex>
      </v-layout>
    </v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <login-twitter></login-twitter>
      </v-flex>
      <v-flex xs12>
        <chat></chat>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import LoginTwitter from '../login-twitter/LoginTwitter'
import Chat from '../chattoggle/ChatToggle'
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  components: {
    LoginTwitter,
    Chat
  },
  computed: {
    allVideos () {
      return this.$store.getters.getRelevant.length
    },
    relevantVideos () {
      let count = 0
      return this.$store.getters.getRelevant.filter(relevant => {
        if (count < this.display) {
          count += 1
          return true
        }
      })
    },
    ...mapGetters([
      'getUser'
    ])
  },
  watch: {
    getUser (newValue) {
      console.log(newValue)
      if (newValue.user_data.like) {
      }
    }
  },
  data () {
    return {
      display: 4
    }
  },
  methods: {
    showMore () {
      this.display += 4
    },
    loadVideos () {
      axios.get('/api/profile/videos', {
        params: {
          cat: this.getUser.user_data.like
        },
        timeout: 60000
      }).then(resp => {
        console.log('/api/profile/videos response: ')
        console.log(resp.data)
        this.$store.commit('SET_RELEVANT', resp.data)
      }).catch(err => {
        console.log('/api/profile/videos Error: ')
        console.log(err)
      })
    }
  }
}
</script>
<style lang="sass">
  @import 'Relevant'
</style>
