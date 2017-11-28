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
          <div class="chatbox-watson" v-if="message.sender === 'watson'" v-html="message.message"></div>
          <a class="hook" v-if="message.hook" @click="gotohook(message.hook)">
            <span>Mostre-me os videos!</span>
          </a>
          <div class="chatbox-user" v-if="message.sender === 'user'">{{ message.message }}</div>
          <v-layout class="chatbox-yn-question" v-if="message.sender === 'question_yn' && message.active">
            <v-dialog v-model="displayLogin" persistent content-class="show-overflow">
              <v-flex xs12 s6 md3 slot="activator" class="option">Sim</v-flex>
              <form class="login-dialog-wrapper">
                <div class="login-dialog-title">
                  <div class="login-feather-detail">
                    <img :src="require('@/assets/svg/login/integri_login.svg')" alt="">
                  </div>
                </div>
                <div class="login-form">
                  <div class="input-addon">
                    <i class="fa fa-user-o" aria-hidden="true"></i>
                    <input type="text" v-model="newUser.name" placeholder="Nome" required>
                  </div>
                  <div class="input-addon">
                    <i class="fa fa-envelope-o" aria-hidden="true"></i>
                    <input type="email" v-model="newUser.email" placeholder="E-mail" required>
                  </div>
                  <div class="input-addon">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                    <input type="password" v-model="newUser.pwd" placeholder="Senha" required>
                  </div>
                  <div class="input-addon">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                    <input type="password" v-model="newUser._pwdConf" placeholder="Confirme sua senha" required>
                  </div>
                </div>
                <v-btn class="blue--text darken-1 login-cancel" flat @click.native="displayLogin = false">Cancelar</v-btn>
                <v-btn class="blue--text darken-1 login-submit" type="button" :disabled="!(newUser.pwd === newUser._pwdConf && newUser.pwd.length > 0)" flat @click.native="saveProfile">Enviar</v-btn>
              </form>
            </v-dialog>
            <v-flex xs12 s6 md3 class="option" @click="message.active = false">Não</v-flex>
          </v-layout>
        </div>
        <div class="chatbox-typing" >
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      <div class="chatbox-footer">
        <input type="text" class="chat-input" v-model="message" v-on:keyup.enter="submit" v-if="!select1.active && !select2.active">
        <div class="selection-box" v-if="select1.active || select2.active">
          <v-select v-bind:items="select1.items" return-object :no-data-text="select1.noData" item-text="nome" item-value="sigla" v-model="select1.model" clearable :label="select1.label" v-if="select1.active" autocomplete :append-icon="select1.icon"></v-select>
        </div>
        <div class="selection-box">
          <v-select v-bind:items="select2.items" v-model="select2.model" :label="select2.label" v-if="select2.active" autocomplete clearable :append-icon="select2.icon"></v-select>
        </div>
        <v-icon :disabled="!canSend" @click="submit">send</v-icon>
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
    },
    states () {
      return this.$store.getters.getStatesCities
    },
    select1Model () {
      return this.select1.model
    },
    canSend () {
      return this.message.length > 0 || this.select1.active && this.select1.model && (this.select1.isParent && this.select2.model || !this.select1.isParent)
    }
  },
  watch: {
    chat (newVal) {
      if (newVal) {
        let lastMsg = newVal[newVal.length - 1]
        let elements
        if (lastMsg.sender === 'user') {
          elements = document.querySelectorAll('.chatbox-user')
        } else {
          elements = document.querySelectorAll('.chatbox-watson')
        }
        let scrollTo = elements[elements.length - 1]
        setTimeout(() => {
          scrollTo.parentElement.parentElement.scrollTop = scrollTo.offsetTop
        }, 350)
      }
    },
    select1Model () {
      if (this.select1Model.cidades) {
        this.select2.items = this.select1Model.cidades
        this.select2.active = true
        this.select2.icon = 'place'
      }
    }
  },
  data () {
    return {
      message: '',
      displayLogin: false,
      newUser: {
        name: '',
        email: '',
        pwd: '',
        _pwdConf: '',
        like: []
      },
      valid: false,
      select1: {
        icon: '',
        isParent: false,
        items: [],
        model: '',
        label: '',
        active: false
      },
      select2: {
        icon: '',
        items: [],
        model: '',
        label: '',
        active: false
      }
    }
  },
  methods: {
    gotohook (hook) {
      console.log(hook)
      switch (hook) {
        case 'relevant':
          document.querySelector('.relevant-title').scrollIntoView({
            behavior: 'smooth'
          })
          break
      }
    },
    submit () {
      let data = null
      if (this.canSend) {
        if (this.select1.active) {
          switch (this.select1.origin) {
            case 'states':
              data = {
                text: this.select2.model + ', ' + this.select1.model.sigla,
                context: this.$store.getters.getContext
              }
              this.select1.active = false
              this.select2.active = false
          }
        } else {
          data = {
            text: this.message,
            context: this.$store.getters.getContext
          }
        }
        console.log(data)
        this.$store.commit('ADD_TEXT', {
          sender: 'user',
          message: data.text
        })
        this.$store.commit('TOGGLE_TYPING')
        this.message = ''
        axios.get('/api/conversation/message', {
          params: data
        }).then(response => {
          this.$store.commit('TOGGLE_TYPING')
          this.$store.commit('SET_CONTEXT', response.data.context)
          response.data.output.text.forEach((text, index) => {
            this.$store.commit('ADD_TEXT', {
              sender: 'watson',
              message: text,
              hook: response.data.context.hook === 'relevant' && index < 1 ? response.data.context.hook : null
            })
          })
          console.log(response.data)
          if (response.data.context.video) {
            this.$store.commit('SET_RELEVANT', response.data.context.video)
          }
          if (response.data.context.user) {
            this.newUser._id = response.data.context.user._id
            this.newUser.like = response.data.context.user.analysis
          }
          if (response.data.context.question_type === 'save_profile') {
            this.$store.commit('ADD_TEXT', {
              sender: 'question_yn',
              active: true
            })
          }
          switch (response.data.context.selection_question) {
            case 'state-city': {
              axios.get('/api/sources/places').then(resp => {
                this.$store.commit('SET_STATES', resp.data)
                this.select1.items = this.states.estados
                this.select1.active = true
                this.select1.noData = 'Selecione um estado'
                this.select1.icon = 'map'
                this.select1.isParent = true
                this.select1.origin = 'states'
              }).catch(err => {
                console.log(err)
              })
              break
            }
            case 'skills':
              break
            case 'causes':
              break
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    close () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
    },
    initChat () {
      return new Promise((resolve, reject) => {
        if (!this.$store.getters.getContext) {
          this.$store.commit('TOGGLE_TYPING')
          axios.get('/api/conversation/init').then(response => {
            this.$store.commit('TOGGLE_TYPING')
            this.$store.commit('SET_CONTEXT', response.data.context)
            response.data.output.text.forEach(text => {
              this.$store.commit('ADD_TEXT', {
                sender: 'watson',
                message: text
              })
            })
            axios.post('/api/access_denied', {
              access_status: false
            })
            resolve(true)
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(false)
        }
      })
    },
    notifyChatDeniedProfile () {
      let data = {
        text: 'sem acesso',
        context: this.$store.getters.getContext,
        trackingProfile: true
      }
      this.$store.commit('TOGGLE_TYPING')
      axios.get('/api/conversation/message', {
        params: data
      }).then(response => {
        this.$store.commit('TOGGLE_TYPING')
        response.data.output.text.forEach(text => {
          this.$store.commit('ADD_TEXT', {
            sender: 'watson',
            message: text
          })
        })
      })
    },
    saveProfile () {
      let user = {
        name: this.newUser.name,
        email: this.newUser.email,
        pwd: this.newUser.pwd,
        like: this.newUser.like
      }
      axios.post('/api/profile/save', user).then(resp => {
        console.log(resp)
        this.displayLogin = false
      }).catch(err => {
        console.log(err)
        this.displayLogin = false
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
