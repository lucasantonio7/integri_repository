<template>
  <div>
    <div class="chat-link" @click="linkToChat">
      <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="">
      <span>Conversar com a Lévi (sem rede social)</span>
    </div>
    <span></span>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    linkToChat () {
      axios.post('/api/access_denied', {
        access_status: true
      }).then(response => {
        this.$store.commit('SET_CHAT_VISIBLE')
        this.$router.push('home')
      })
    }
  }
}
</script>
<style lang="sass">
  @import './ChatLink'
</style>
