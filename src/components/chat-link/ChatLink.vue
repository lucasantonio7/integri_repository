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
        if (this.$store.getters.getContext) {
          this.$store.commit('START_TO_GET_PROFILE')
        }
        this.$router.push('home')
      })
    }
  }
}
</script>
<style lang="sass">
  @import './ChatLink'
</style>
