<template>
  <div class="integri">
    <v-container grid-list-xs text-xs-center fluid>
      <v-layout row wrap>
        <v-flex xs12 lg6>
          <v-container>
            <h3 class="display-2 white--text py-4">Bem vindo!</h3>
            <blockquote class="headline white--text pr-5 pl-5 py-3">Somos uma plataforma focada em despertar a Responsabilidade Social Individual das pessoas, 
              interligando indivíduos às práticas do bem, por meio de conteúdo inspiracional, cursos, vídeos e oportunidades de voluntariado.</blockquote>
            <v-layout row="" wrap="">
              <v-flex xs12 md4 py-5>
                <img class="pa-3 pr-5 pl-5 pb-3 full-img" :src="require('@/assets/svg/home/faixa_tempo.svg')" alt="">
                <h5 class="white--text pr-5 pl-5 py-3 title">No seu tempo</h5>
              </v-flex>
              <v-flex xs12 md4 py-5>
                <img class="pa-3 pr-5 pl-5 full-img" :src="require('@/assets/svg/home/faixa_proposito.svg')" alt="">
                <h5 class="white--text pr-5 pl-5 py-3 title">De acordo com o seu propósito</h5>
              </v-flex>
              <v-flex xs12 md4 py-5>
                <img class="pa-3 pr-5 pl-5 full-img" :src="require('@/assets/svg/home/faixa_forma.svg')" alt="">
                <h5 class="white--text pr-5 pl-5 py-3 title">Da melhor forma para você</h5>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs12 lg6>
          <!-- <youtube-video-component :video="vdata" :showDescription="true"></youtube-video-component> -->
          <v-container fill-height>
            <v-layout align-center>
              <youtube class="responsive-yt" :video-id="videoid" @ready="ready" @playing="playing"></youtube>
            </v-layout>
          </v-container>
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
  },
  methods: {
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
  @import './integri.scss'
</style>

