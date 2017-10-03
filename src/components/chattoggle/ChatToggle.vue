<template>
  <div>
    <div class="chat-btn" @click="toggle">
      <span v-if="displayLabel">
        <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="">
        <span class="text-piece">Conte-nos sobre você!</span>
      </span>
    </div>
    <div class="chat-toggle" v-if="displayChat">
      <chat></chat>
    </div>
  </div>
</template>

<script>
import Chat from '../chat/Chat'
export default {
  components: {
    Chat
  },
  computed: {
    displayChat () {
      return this.$store.getters.displayChat.active
    },
    displayLabel () {
      return this.$store.getters.displayLabel.active
    }
  },
  methods: {
    toggle () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')

      if (this.displayChat) {
        this.$store.commit('HIDE_CHAT_NOTIFICATION')
        this.$store.commit('HIDE_CHAT_LABEL')
      }
    }
  }
}
</script>
<style lang="sass">
  @import 'ChatToggle'
</style>
