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
        <div class="chatbox-dialog-line" v-for="(message, index) in chat" :key="index">
          <div class="chatbox-watson" v-if="message.sender === 'watson'">{{ message.message }}</div>
          <div class="chatbox-user" v-if="message.sender === 'user'">{{ message.message }}</div>
        </div>
        <div class="chatbox-typing" v-if="isTyping">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
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
  computed: {
    chat () {
      return this.$store.getters.getChat
    },
    isTyping () {
      return this.$store.getters.isTyping
    },
    isDenied () {
      return this.$store.getters.getUser.access_denied
    },
    askingProfile () {
      return this.$store.getters.displayChat.askingProfile
    }
  },
  watch: {
    isDenied (newVal) {
      // if (newVal) {
      console.log('Watcher')
      console.log(newVal)
      // }
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    submit () {
      let data = {
        text: this.message,
        context: this.$store.getters.getContext
      }
      console.log(data)
      this.$store.commit('ADD_TEXT', {
        sender: 'user',
        message: data.text
      })
      this.message = ''
      axios.get('/api/conversation/message', {
        params: data
      }).then(response => {
        this.$store.commit('SET_CONTEXT', response.data.context)
        response.data.output.text.forEach(text => {
          this.$store.commit('ADD_TEXT', {
            sender: 'watson',
            message: text
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    close () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
    },
    notifyChatDeniedProfile () {
      let data = {
        text: 'sem acesso',
        context: this.$store.getters.getContext,
        trackingProfile: true
      }
      axios.get('/api/conversation/message', {
        params: data
      }).then(response => {
        response.data.output.text.forEach(text => {
          this.$store.commit('ADD_TEXT', {
            sender: 'watson',
            message: text
          })
        })
      })
    },
    initChat () {
      return new Promise((resolve, reject) => {
        if (!this.$store.getters.getContext) {
          axios.get('/api/conversation/init').then(response => {
            this.$store.commit('SET_CONTEXT', response.data.context)
            response.data.output.text.forEach(text => {
              this.$store.commit('ADD_TEXT', {
                sender: 'watson',
                message: text
              })
            })
            resolve(true)
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(false)
        }
      })
    }
  },
  mounted () {
    document.querySelector('.chat-wrapper').scrollIntoView({
      behavior: 'smooth'
    })
    this.initChat().then(res => {
      console.log(this.isDenied)
      if (this.isDenied) {
        this.notifyChatDeniedProfile()
      }
    }).catch(err => {
      console.log(err)
    })
  }
}

</script>
<style lang="sass">
  @import 'Chat'
</style>
