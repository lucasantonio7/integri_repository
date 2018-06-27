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
    <v-container fill-height fluid="" v-lock class="levi-wrapper animated fadeIn" :class="{'mobile': $vuetify.breakpoint.smAndDown}" pt-3 :px-5="$vuetify.breakpoint.mdAndUp" :pt-5="$vuetify.breakpoint.mdAndUp" v-if="getUser.login || gettingProfile">
      <!-- desktop -->
      <v-layout row wrap>
        <v-flex xs12 sm6 md6 class="levi-flex" :pa-5="$vuetify.breakpoint.mdAndUp" :class="{'mobile': $vuetify.breakpoint.smAndDown}">
          <img :src="require('@/assets/png/logo/feliz.png')" class="levi" alt="">
        </v-flex>
        <v-flex xs12 sm6 md6 :py-5="$vuetify.breakpoint.mdAndUp" :pr-5="$vuetify.breakpoint.mdAndUp" class="message-flex">
          <v-layout column="">
            <v-flex xs6 :py-5="$vuetify.breakpoint.mdAndUp">
              <div class="balloon animated tada pt-5 pb-3" :class="balloonClasses">
                <p class="white--text" :pl-4="$vuetify.breakpoint.mdAndUp" :class="titleClasses">{{ title }}</p>
                <p class="white--text" :pl-4="$vuetify.breakpoint.mdAndUp" :class="contentClasses" v-for="(msg, index) in defaultMsg" :key="index">
                  {{ msg }}
                </p>
              </div>
            </v-flex>
            <v-flex :mx-5="$vuetify.breakpoint.mdAndUp">
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
        return 'Olá, que bom ver você!'
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
      return this.$store.getters.isLeviGettingProfile
    },
    balloonClasses () {
      if (this.$vuetify.breakpoint.smAndDown) {
        return ['mobile', 'pr-3', 'pl-5']
      } else {
        return ['px-5']
      }
    },
    titleClasses () {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return ['display-1']
      } else {
        // Mobile
        return ['title']
      }
    },
    contentClasses () {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return ['headline']
      } else {
        // Mobile
        return ['subtitle']
      }
    },
    keys () {
      return [32, 33, 34, 35, 36, 37, 38, 39, 40]
    }
  },
  directives: {
    lock: {
      inserted: (el, binding, vnode) => {
        if (window.addEventListener) {
          window.addEventListener('DOMMouseScroll', vnode.context.preventDefault, false)
        }
        document.addEventListener('touchmove', vnode.context.preventDefault, false)
        window.onmousewheel = document.onmousewheel = vnode.context.preventDefault
        document.onkeydown = vnode.context.keydown
        document.documentElement.style.overflow = 'hidden'
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.$store.getters.displayChat.active) {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
      next()
    } else {
      next()
    }
  },
  methods: {
    callChat () {
      if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', this.preventDefault, false)
      }
      window.onmousewheel = document.onmousewheel = document.onkeydown = null
      document.removeEventListener('touchmove', this.preventDefault, false)
      document.documentElement.style.overflow = 'scroll'
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
    },
    preventDefault (e) {
      e = e || window.event
      if (e.preventDefault) {
        e.preventDefault()
      }
      e.returnValue = false
    },
    keydown (e) {
      for (var i = this.keys.length; i--;) {
        if (e.keyCode === this.keys[i]) {
          this.preventDefault(e)
          return
        }
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0)
  }
}
</script>
<style lang="sass">
  @import './Home.scss'
</style>
