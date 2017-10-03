<template>
  <div class="fbc" @click="toggle" :class="{'notify-user': isDenied && isNotificationActive}">
    <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="" :class="{'animated tada': isDenied}">
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
  }
}
</script>

<style lang="sass">
  @import './FBC'
</style>
