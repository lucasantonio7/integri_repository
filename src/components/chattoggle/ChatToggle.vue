<template>
  <div>
    <div class="chat-btn" @click="toggle">
      <span v-if="displayLabel">
        <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="">
        <span v-if="!user.login" class="text-piece">Conte-nos sobre você!</span>
        <span v-if="user.login" class="text-piece">Dúvidas? Fale conosco!</span>
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
    },
    user () {
      return this.$store.getters.getUser
    }
  },
  watch: {
    user (newVal) {
      if (newVal.user_data) {
        console.log(newVal.user_data)
        if (newVal.user_data.medias.facebook) {
          this.$store.commit('SET_ACCESS_SOURCE', 'Facebook')
        } else if (newVal.user_data.medias.twitter) {
          this.$store.commit('SET_ACCESS_SOURCE', 'Twitter')
        } else {
          this.$store.commit('SET_ACCESS_SOURCE', 'Integri')
        }
        this.$nextTick().then(() => {
          this.$store.commit('SET_CHAT_VISIBLE')
        })
      }
    }
  },
  methods: {
    toggle () {
      console.log('Toggle chamado')
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
