<template>
  <div>
    <div class="chat-btn" @click="toggle">
      <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="">
      <span class="text-piece">Conte-nos sobre você!</span>
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
      return this.$store.getters.displayChat
    }
  },
  methods: {
    toggle () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
    }
  }
}
</script>
<style lang="sass">
  @import 'ChatToggle'
</style>
