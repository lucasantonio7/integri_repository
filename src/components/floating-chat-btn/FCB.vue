<template>
  <div @click="toggle">
    <div class="message animated fadeInRight" v-if="displayMsg" :class="{'small': $vuetify.breakpoint.smAndDown}">
      Oi! Se tiver alguma dúvida, clique aqui para falar comigo!
    </div>
    <div class="fbc animated bounceIn" :class="{'notify-user': isDenied && isNotificationActive, 'small': $vuetify.breakpoint.smAndDown}">
      <img :src="require('@/assets/png/logo/amoroso.png')" alt="" :class="{'animated tada': isDenied}">
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    isDenied () {
      return this.$store.getters.getUser.access_denied
    },
    isNotificationActive () {
      return this.$store.getters.displayChat.isNotificationActive
    },
    displayChat () {
      return this.$store.getters.displayChat.active
    }
  },
  data: () => ({
    displayMsg: false
  }),
  watch: {
    isDenied (newVal) {
      if (newVal) {
        this.$store.commit('SHOW_CHAT_NOTIFICATION')
      }
    }
  },
  methods: {
    toggle () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
      if (this.displayChat) {
        this.$store.commit('HIDE_CHAT_NOTIFICATION')
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.displayMsg = true
    }, 800)
  }
}
</script>

<style lang="sass">
  @import './FBC'
</style>
