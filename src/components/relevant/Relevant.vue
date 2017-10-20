<template>
  <div class="relevant-wrapper">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h6 class="relevant-title" v-if="!getUser.login">Relevantes para você</h6>
          <h6 class="relevant-title" v-if="getUser.login">Selecionei alguns vídeos para você</h6>
        </v-flex>
        <v-flex xs12 md4 lg3 v-for="(video, index) in relevantVideos" :key="index">
          <youtube :video-id="video" class="responsive-yt"></youtube>
        </v-flex>
        <v-flex xs12 class="text-xs-right load-new">
          <a @click="showMore" v-if="display < allVideos">Ver mais</a>
        </v-flex>
      </v-layout>
    </v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <jorney></jorney>
      </v-flex>
      <v-flex xs12>
        <chat></chat>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import Jorney from '../jorney/Jorney'
import Chat from '../chattoggle/ChatToggle'
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  components: {
    Jorney,
    Chat
  },
  computed: {
    display () {
      return this.getUser.login ? 8 : 4
    },
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
        axios.get('/api/profile/videos', {
          params: {
            cat: newValue.user_data.like
          }
        }).then(resp => {
          console.log('/api/profile/videos response: ')
          console.log(resp.data)
          this.$store.commit('SET_RELEVANT', resp.data)
          document.querySelector('.relevant-title').scrollIntoView({
            behavior: 'smooth'
          })
        }).catch(err => {
          console.log('/api/profile/videos Error: ')
          console.log(err)
        })
      }
    }
  },
  data () {
    return {
      // display: 4
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
  @import 'Relevant'
</style>
