<template>
  <div class="homepage">
    <v-card-media :src="require('@/assets/jpg/home-min.jpeg')" height="553px" class="home-mask" v-if="!getUser.login && !gettingProfile">
      <v-container fill-height fluid>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 justify-center class="home-middle-container">
            <img :src="require('@/assets/svg/home/Integri_circle.svg')" alt="">
            <jorney class="home-middle-btn" v-ripple></jorney>
          </v-flex>
          <fcb></fcb>
        </v-layout>
      </v-container>
    </v-card-media>
    <v-container fill-height fluid="" class="levi-wrapper animated fadeIn" py-0 px-5 :pt-5="$vuetify.breakpoint.mdAndUp" v-if="getUser.login || gettingProfile">
      <v-layout row wrap>
        <v-flex xs12 md6 class="levi-flex" pa-5>
          <img :src="require('@/assets/png/logo/confiante_cropped.png')" class="levi" alt="">
        </v-flex>
        <v-flex xs12 md6 py-5 pr-5 class="message-flex">
          <v-layout column="" wrap>
            <v-flex xs6 pt-5>
              <div class="balloon pa-5 animated tada">
                <p class="display-1 white--text pl-4">{{ title }}</p>
                <p class="title white--text pl-4" v-for="(msg, index) in defaultMsg" :key="index">
                  {{ msg }}
                </p>
              </div>
            </v-flex>
            <v-flex pb-5 mx-5>
              <v-btn block large dark class="message-hook elevation-4" @click="callChat">{{ callToAction }}</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <integri v-if="!getUser.login"></integri>
    <trends></trends>
    <relevant></relevant>
  </div>
</template>
<script>
import Jorney from '../jorney/Jorney'
import Integri from '../integri/Integri'
import Trends from '../trends/Trends'
import Relevant from '../relevant/Relevant'
import fcb from '../floating-chat-btn/FCB'
import { mapGetters } from 'vuex'
export default {
  components: {
    Jorney,
    Integri,
    Trends,
    Relevant,
    fcb
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    defaultMsg () {
      if (this.gettingProfile) {
        return [
          'Quero te inspirar para ver você como um agente da mudança! Seja na sua casa, na sua comunidade e até no mundo. Para isso, preciso entender melhor o seu perfil.',
          'Você aceita responder algumas perguntas enquanto te mostro mais sobre o voluntariado?'
        ]
      } else {
        return [`Veja o que encontrei com base na análise de seu perfil do ${this.$store.getters.getAccessSource}. Clique no botão abaixo e vamos iniciar a sua jornada!`]
      }
    },
    title () {
      if (this.gettingProfile) {
        return 'Olá, que bom ver você de novo!'
      } else {
        return `Olá, ${this.getUser.user_data.name}`
      }
    },
    callToAction () {
      if (this.gettingProfile) {
        return 'Vamos lá!'
      } else {
        return 'Mostre-me!'
      }
    },
    gettingProfile () {
      if (this.$store.getters.getContext) {
        if (this.$store.getters.getContext.gettingProfile === 'started') {
          console.log(this.$store.getters.getContext.gettingProfile)
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    console.log('Display Chat')
    if (this.$store.getters.displayChat.active) {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
      next()
    }
  },
  methods: {
    callChat () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
    }
  }
}
</script>
<style lang="sass">
  @import './Home.scss'
</style>
