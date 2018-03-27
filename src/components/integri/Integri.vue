<template>
  <div class="integri">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap justify-center="">
        <v-flex xs12>
          <h3 class="display-2 white--text py-4">Bem vindo!</h3>
          <blockquote class="headline white--text pr-5 pl-5 py-3">Somos uma plataforma focada em despertar a Responsabilidade Social Individual das pessoas, 
            interligando indivíduos às práticas do bem, por meio de conteúdo inspiracional, cursos, vídeos e oportunidades de voluntariado.</blockquote>
        </v-flex>
        <v-flex xs12 md10 py-5>
          <youtube-video-component :video="vdata" :showDescription="false"></youtube-video-component>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import YoutubeVideoComponent from '../yt-video-component/YoutubeVideoComponent'
export default {
  components: {YoutubeVideoComponent},
  data () {
    return {
      videoid: 'p0iZ6t-SP9s',
      vdata: {}
    }
  },
  mounted () {
    this.$store.dispatch('GET_VIDEO', this.videoid).then(res => {
      this.vdata = res
      console.log(res)
    }).catch(err => [
      console.log(err)
    ])
  }
}
</script>

<style lang="sass">
  @import './integri.scss'
</style>

