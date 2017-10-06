<template>
  <div class="relevant-wrapper">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h6 class="relevant-title">Relevantes para você</h6>
        </v-flex>
        <v-flex xs12 md4 lg3 v-for="(video, index) in videos" :key="index">
          <youtube :video-id="video" class="responsive-yt"></youtube>
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
export default {
  components: {
    LoginTwitter,
    Chat
  },
  computed: {
    videos () {
      return this.$store.getters.getRelevant
    }
  }
}
</script>
<style lang="sass">
  @import 'Relevant'
</style>
