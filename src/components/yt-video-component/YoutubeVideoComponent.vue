<template>
  <v-container>
    <v-layout row justify-center>
      <v-card @click.native.stop="playVideo">
        <div class="thumbnail">
          <img :src="video.thumbnail.url" :alt="video.title">
        </div>
        <v-list two-line subheader v-if="showDescription">
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ video.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ video.channel }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  props: {
    video: Object,
    showDescription: {
      default: true
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  computed: {
    playerActive () {
      return this.$store.getters.getPlayerStatus
    }
  },
  methods: {
    playVideo () {
      this.$store.commit('PLAY_VIDEO', this.video)
    }
  }
}

</script>
<style lang="sass">
  @import './YoutubeVideoComponent.scss'
</style>
