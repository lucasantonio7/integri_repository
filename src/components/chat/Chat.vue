<template>
  <div class="chat-wrapper">
    <div class="chat-header">
      <v-toolbar dark class="chat-customized-toolbar">
        <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="">
        <img :src="require('@/assets/svg/home/Integri.svg')" alt="Integri" class="text-part">
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
    </div>
    <div class="chatbox-messages">
      <div class="chatbox-messages-wrapper">
        <div class="chatbox-dialog-line" v-for="message in dialog" :key="message">
          <div class="chatbox-watson" v-if="message.sender === 'watson'">{{ message.message }}</div>
          <div class="chatbox-user" v-if="message.sender === 'user'">{{ message.message }}</div>
        </div>
      </div>
      <div class="chatbox-footer">
        <input type="text" class="chat-input" v-model="message" v-on:keyup.enter="submit">
        <v-icon>send</v-icon>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      dialog: [],
      message: ''
    }
  },
  methods: {
    submit () {
      axios.get('/api/conversation/message', {
        params: {
        }
      })
    },
    close () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
    }
  }
}
</script>
<style lang="sass">
  @import 'Chat'
</style>
