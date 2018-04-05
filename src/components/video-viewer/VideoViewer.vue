<template>
  <v-container>
    <v-layout>
      <v-dialog v-model="playerActive" persistent :fullscreen="$vuetify.breakpoint.smAndDown" :max-width="videoDimensions">
        <v-layout row wrap :class="{'fsactive': $vuetify.breakpoint.smAndDown}" >
          <v-toolbar dark>
            <v-btn @click.native="closeModal" flat dark :disabled="!player">
              <v-icon left>fa fa-chevron-left</v-icon>
              Voltar
            </v-btn>
          </v-toolbar>
          <v-flex xs12>
            <youtube class="responsive-yt" :video-id="vid.id" :player-width="vid.thumbnail.width" :player-height="vid.thumbnail.height"  @ready="ready" @playing="playing"></youtube>
          </v-flex>
        </v-layout>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      player: null
    }
  },
  computed: {
    playerActive: {
      get () {
        return this.$store.getters.getPlayerStatus
      },
      set () {
      }
    },
    vid () {
      return this.$store.getters.getCurrentVideo
    },
    videoDimensions () {
      if (!this.$vuetify.breakpoint.smAndDown) {
        return this.$vuetify.breakpoint.width * 0.7
      }
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('STOP_VIDEO')
      this.player.stopVideo()
    },
    ready (player) {
      this.player = player
    },
    playing (player) {
      // The player is playing a video.
    }
  }
}
</script>
<style lang="sass">
  @import './VideoViewer.scss'
</style>
