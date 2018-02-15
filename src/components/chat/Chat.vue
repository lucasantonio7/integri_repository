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
        <div class="chatbox-dialog-line" v-for="(message, index) in chat" :key="index" :class="{ deactivated: !message.active && message.type === 'yn_question' }">
          <div class="chatbox-watson" v-if="message.sender === 'watson'" v-html="message.message"></div>
          <v-container grid-list-md text-xs-center v-if="message.videos">
            <carousel :perPage="1" :navigationEnabled="true" class="video-slider">
              <slide v-for="(groups,i) in videosGroups" :key="i">
                <v-layout row wrap>
                  <v-flex class="video-card" d-flex xs6 sm3 v-for="(video,i) in groups" :key="i" @click="showModal(video)">
                    <v-card>
                      <img class="video-thumbnail" :src="video.snippet.thumbnails.medium.url" alt="">
                      <v-card-text>{{ video.snippet.title }}</v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </slide>
            </carousel>
          </v-container>
          <v-container grid-list-md text-xs-center v-if="message.opportunities">
            <carousel :perPage="1" :navigationEnabled="true" class="video-slider">
              <slide v-for="(groups,i) in opptyGroups" :key="i">
                <v-layout row wrap>
                  <v-flex class="video-card" d-flex xs6 sm3 v-for="(oppty,i) in groups" :key="i" @click="goToOppty(oppty)">
                    <v-card>
                      <div class="thumbnail-opportunity">
                        <img class="video-thumbnail" :src="oppty.image.image_small_url" alt="">
                      </div>
                      <v-card-text>{{ oppty.name }}</v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </slide>
            </carousel>
          </v-container>
          <div class="chatbox-user" v-if="message.sender === 'user'">{{ message.message }}</div>
          <v-container grid-list-md v-if="message.type === 'yn_question' && message.active">
            <v-layout row class="chatbox-yn-question" >
              <v-flex xs12 s5 md4 @click="YNSelector(true, message)">
                <v-btn block flat large>
                  {{ message.options.yes }}
                  <v-icon right dark v-if="message.action === 'feedback'">fa fa-thumbs-up</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12 s5 md4 @click="YNSelector(false, message)">
                <v-btn block flat large>
                  {{ message.options.no }}
                  <v-icon right dark v-if="message.action === 'feedback'">fa fa-thumbs-down</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
        <div class="chatbox-dialog-line" v-show="isTyping">
          <div class="chatbox-typing">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
        <v-dialog v-model="displayLoginBox" persistent content-class="show-overflow">
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
              <v-layout>
                <v-flex>
                  <span class="savebox-error-msg animated pulse" v-if="error">{{ error.message }}</span>
                </v-flex>
              </v-layout>
            </div>
            <v-btn class="blue--text darken-1 login-cancel" flat @click.native="displayLoginBox = false">Cancelar</v-btn>
            <v-btn class="blue--text darken-1 login-submit" type="button" :disabled="!(newUser.pwd === newUser._pwdConf && newUser.pwd.length > 0)" flat @click.native="saveProfile">Enviar</v-btn>
          </form>
        </v-dialog>
      </div>
      <div class="chatbox-footer" :class="{'box': select1.active || select2.active, 'box-disabled': !inputBoxEnabled}" >
        <input ref="inputbox" type="text" class="chat-input" v-model="message" :disabled="!inputBoxEnabled" v-on:keyup.enter="submit" v-if="inputboxactive">
        <div class="selections" v-if="select1.active || select2.active">
          <div class="selection-box">
            <v-select solo v-on:keyup.enter="submit" v-bind:items="select1.items" single-line :multiple="select1.multi" return-object :no-data-text="select1.noData" :item-text="select1.item_text" :item-value="select1.item_value" v-model="select1.model" clearable :label="select1.label" v-if="select1.active" autocomplete :append-icon="select1.icon"></v-select>
          </div>
          <div class="selection-box">
            <v-select solo v-on:keyup.enter="submit" v-bind:items="select2.items" :multiple="select2.multi" v-model="select2.model" :label="select2.label" v-if="select2.active" autocomplete clearable :prepend-icon="select2.icon"></v-select>
          </div>
        </div>
        <v-icon :disabled="!canSend" @click="submit">send</v-icon>
      </div>
    </div>
    <v-dialog v-model="showVideo" persistent :max-width="currentVideo.thumbnail.width" :width="currentVideo.thumbnail.width">
      <div class="floating-video">
        <span class="close-btn" @click="closeModal"><i class="fa fa-chevron-left" aria-hidden="true"></i>Voltar</span>
        <youtube :video-id="currentVideo.id" :player-vars="{ autoplay: 1 }" :player-width="currentVideo.thumbnail.width" :player-height="currentVideo.thumbnail.height" class="responsive-yt" @ready="ready"></youtube>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  computed: {
    causes () {
      return this.$store.getters.getCauses
    },
    capturedDialog () {
      return this.$store.getters.getCapturedDialog
    },
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
    skills () {
      return this.$store.getters.getSkills
    },
    select1Model () {
      return this.select1.model
    },
    canSend () {
      return this.message.length > 0 || this.select1.active && this.select1.model && (this.select1.isParent && this.select2.model || !this.select1.isParent)
    },
    returnedVideos () {
      return this.$store.getters.getRelevant
    },
    returnedOppty () {
      return this.$store.getters.getOpportunities
    },
    opptyGroups () {
      let groups = []
      let index = 0
      this.returnedOppty.forEach(oppty => {
        if (groups.length < 1) {
          groups.push([])
        }
        if (groups[index].length < 4) {
          groups[index].push(oppty)
        } else {
          index++
          groups.push([])
          groups[index].push(oppty)
        }
      })
      return groups
    },
    userData () {
      return this.$store.getters.getUser
    },
    videosGroups () {
      let groups = []
      let index = 0
      this.returnedVideos.forEach(vid => {
        if (groups.length < 1) {
          groups.push([])
        }
        if (groups[index].length < 4) {
          groups[index].push(vid)
        } else {
          index++
          groups.push([])
          groups[index].push(vid)
        }
      })
      return groups
    },
    inputboxactive () {
      return !this.select1.active && !this.select2.active
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
      axiosUrl: '',
      axiosConfig: {},
      axiosOppty: '',
      currentVideo: {
        active: false,
        id: '',
        thumbnail: {
          width: '',
          height: '',
          url: ''
        }
      },
      inputBoxEnabled: true,
      message: '',
      displayLoginBox: false,
      newUser: {
        name: '',
        email: '',
        pwd: '',
        _pwdConf: '',
        like: []
      },
      newDialog: null,
      video_group: [],
      valid: false,
      select1: {
        icon: '',
        isParent: false,
        items: [],
        model: '',
        label: '',
        active: false,
        multi: false,
        item_value: '',
        item_text: ''
      },
      select2: {
        icon: '',
        items: [],
        model: '',
        label: '',
        active: false,
        multi: false,
        item_value: '',
        item_text: ''
      },
      showVideo: false,
      error: {
        message: ''
      },
      feedback: null,
      isFeedback: null
    }
  },
  methods: {
    ready (player) {
      this.player = player
    },
    showMore () {
      this.display += 4
    },
    showModal (video) {
      this.currentVideo.thumbnail = video.snippet.thumbnails.high
      this.currentVideo.id = video.id
      this.showVideo = true
    },
    closeModal () {
      this.player.stopVideo()
      this.showVideo = false
    },
    setSelect (target, payload) {
      for (let prop in payload) {
        target[prop] = payload[prop]
      }
    },
    adjustLocationByOppty () {
      if (this.newUser.location) {
        if (this.needAPIBeta(this.newUser.location)) {
          this.axiosUrl = 'https://api.beta.atados.com.br/'
          this.axiosConfig = {headers: {'X-ovp-channel': 'pv'}}
          this.axiosOppty = 'https://beta.parceirosvoluntarios.atados.com.br/vaga/'
        } else {
          this.axiosUrl = 'https://v2.api.atados.com.br/'
          this.axiosConfig = {headers: {'X-ovp-channel': 'default'}}
          this.axiosOppty = 'https://atados.com.br/vaga/'
        }
      } else if (this.needAPIBeta(this.userData.user_data.location)) {
        this.axiosUrl = 'https://api.beta.atados.com.br/'
        this.axiosConfig = {headers: {'X-ovp-channel': 'pv'}}
        this.axiosOppty = 'https://beta.parceirosvoluntarios.atados.com.br/vaga/'
      } else {
        this.axiosUrl = 'https://v2.api.atados.com.br/'
        this.axiosConfig = {headers: {'X-ovp-channel': 'default'}}
        this.axiosOppty = 'https://atados.com.br/vaga/'
      }
    },
    needAPIBeta (value) {
      value = value.toLowerCase()
      console.log(value)
      if (value.includes('rio grande do sul')) {
        return true
      } else {
        return this.states.some(state => {
          if (state.sigla === 'RS') {
            return state.cidades.some(city => {
              return value.includes(city.toLowerCase())
            })
          } else {
            return false
          }
        })
      }
    },
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
    goToOppty (oppty) {
      this.adjustLocationByOppty()
      window.open(this.axiosOppty + oppty.slug, '_blank')
    },
    YNSelector (payload, message) {
      message.active = false
      if (payload) {
        if (message.action === 'save_profile') {
          this.displayLoginBox = true
        } else {
          this.message = message.options.yes
          if (message.action === 'feedback') {
            this.feedback = true
          }
          this.$nextTick().then(() => {
            this.submit()
          })
        }
      } else {
        this.message = message.options.no
        if (message.action === 'feedback') {
          this.feedback = false
        }
        this.$nextTick().then(() => {
          this.submit()
        })
      }
      this.inputBoxEnabled = true
    },
    processMessage (response) {
      this.$store.commit('DEACTIVATE_TYPING')
      console.log(response)
      switch (response.data.context.capture_user_feedback) {
        case 'started':
          if (!this.capturedDialog) {
            this.newDialog = {
              _id: Date.now(),
              captured: Date.now(),
              messages: []
            }
          } else {
            this.newDialog = this.capturedDialog
          }
          response.data.output.text.forEach((text, index) => {
            this.newDialog.messages.push({
              sender: 'watson',
              message: text
            })
          })
          this.$store.commit('SET_CAPTURED_DIALOG', this.newDialog)
          break
        case 'finished':
          axios.post('/api/conversation/savedialog', {data: this.capturedDialog}).then(resp => {
            console.log(resp)
          }).catch(err => {
            if (err.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(err.response.data)
              console.log(err.response.status)
              console.log(err.response.headers)
            } else if (err.request) {
              // The request was made but no response was received
              // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(err.request)
            } else {
              // Something happened in setting up the request that triggered an err
              console.log('err', err.message)
            }
            console.log(err.config)
          })
          response.data.context.capture_user_feedback = null
          break
      }
      switch (response.data.context.hook) {
        case 'login':
          delete response.data.context.hook
          this.$store.commit('SET_CONTEXT', response.data.context)
          this.$router.push('login')
          break
      }
      this.$store.commit('SET_CONTEXT', response.data.context)
      console.log(response.data.context)
      response.data.output.text.forEach((text, index) => {
        if (text.includes('user_name')) {
          text = text.replace('user_name', this.$store.getters.getUser.user_data.name)
        }
        if (text.includes('social_media')) {
          text = text.replace('social_media', this.$store.getters.getAccessSource)
        }
        this.$store.commit('ADD_TEXT', {
          sender: 'watson',
          message: text,
          videos: response.data.context.display === 'videos' ? true : null,
          opportunities: response.data.context.display === 'opportunity' ? true : null
        })
        if (response.data.context.video && response.data.context.display) {
          console.log(response.data.context.video)
          this.$store.commit('SET_RELEVANT', response.data.context.video)
          delete response.data.context.display
          delete response.data.context.video
          this.$store.commit('SET_CONTEXT', response.data.context)
        }
        if (response.data.context.opportunities) {
          console.log(response.data.context.opportunities)
          this.$store.commit('SET_OPPORTUNITIES', response.data.context.opportunities)
          delete response.data.context.display
          delete response.data.context.opportunities
          this.$store.commit('SET_CONTEXT', response.data.context)
        }
      })
      if (response.data.context.user) {
        this.newUser._id = response.data.context.user._id
        this.newUser.like = response.data.context.user.analysis
      }
      if (response.data.context.question) {
        if (response.data.context.question.type === 'yn_question') {
          this.inputBoxEnabled = false
          this.$nextTick().then(() => {
            this.$store.commit('ADD_TEXT', {
              type: 'yn_question',
              action: response.data.context.question.action,
              active: true,
              options: response.data.context.question.options ? response.data.context.question.options : {yes: 'Sim', no: 'Não'}
            })
          })
          response.data.context.question.action === 'feedback' ? this.isFeedback = true : this.isFeedback = false
        }
      }
      switch (response.data.context.selection_question) {
        case 'state-city': {
          this.$store.dispatch('LOAD_STATES').then(resp => {
            this.select1.items = this.states
            this.select1.active = true
            this.select1.noData = 'Selecione um estado'
            this.select1.icon = 'map'
            this.select1.isParent = true
            this.select1.origin = 'states'
            this.select1.item_value = 'nome'
            this.select1.item_text = 'nome'
            this.select1.multi = false
          }).catch(err => {
            console.log(err)
          })
          break
        }
        case 'skills':
          if (!this.skills) {
            this.adjustLocationByOppty()
            axios.get(this.axiosUrl + '/startup/', this.axiosConfig).then(resp => {
              this.$store.commit('SET_SKILLS', resp.data.skills)
              this.select1.items = this.skills
              this.select1.active = true
              this.select1.noData = 'Selecione uma ou mais habilidades'
              this.select1.icon = 'playlist_add'
              this.select1.isParent = false
              this.select1.origin = 'skills'
              this.select1.multi = true
              this.select1.model = []
              this.select1.item_value = 'name'
              this.select1.item_text = 'name'
              if (resp.data.causes) {
                this.$store.commit('SET_CAUSES', resp.data.causes)
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.setSelect(this.select1, {items: this.skills,
              active: true,
              noData: 'Selecione uma ou mais habilidades',
              icon: 'playlist_add',
              isParent: false,
              origin: 'skills',
              multi: true,
              model: [],
              item_value: 'name',
              item_text: 'name'})
          }
          break
        case 'causes':
          this.adjustLocationByOppty()
          axios.get(this.axiosUrl + '/startup/', this.axiosConfig).then(resp => {
            console.log(resp)
            this.$store.commit('SET_CAUSES', resp.data.causes)
            this.select1.items = this.causes
            this.select1.active = true
            this.select1.noData = 'Selecione uma ou mais causas'
            this.select1.icon = 'map'
            this.select1.isParent = false
            this.select1.origin = 'causes'
            this.select1.multi = true
            this.select1.model = []
            this.select1.item_value = 'name'
            this.select1.item_text = 'name'
            if (resp.data.skills) {
              this.$store.commit('SET_SKILLS', resp.data.skills)
            }
          }).catch(err => {
            console.log(err)
          })
          break
        default:
          this.select1.active = false
          this.select2.active = false
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
              if (this.$store.getters.getUser.login) {
                let userData = this.$store.getters.getUser
                userData.user_data.location = this.select2.model + ', ' + this.select1.model.nome
                this.$store.commit('SET_USER', userData)
                this.$store.commit('SET_CONTEXT', Object.assign(this.$store.getters.getContext, {userLocation: userData.user_data.location}))
                // OBS: Salvar usuário
              } else {
                this.newUser.location = this.select2.model + ', ' + this.select1.model.nome
              }
              this.select1.active = false
              this.select2.active = false
              break
            case 'skills':
              this.$store.commit('SET_CONTEXT', Object.assign(this.$store.getters.getContext, {skills: this.select1.model}))
              data = {
                text: 'Tenho experiência com ' + this.select1.model.map(item => item.name).join(', '),
                context: this.$store.getters.getContext
              }
              this.select1.active = false
              break
            case 'causes':
              this.$store.commit('SET_CONTEXT', Object.assign(this.$store.getters.getContext, {causes: this.select1.model}))
              data = {
                text: 'As causas que mais me identifico são as de ' + this.select1.model.map(item => item.name).join(', '),
                context: this.$store.getters.getContext
              }
              this.select1.active = false
              break
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
        if (this.capturedDialog !== null) {
          this.newDialog = this.capturedDialog
          this.newDialog.messages.push({
            sender: 'user',
            message: data.text,
            feedback: this.feedback,
            isFeedback: this.isFeedback
          })
          this.$store.commit('SET_CAPTURED_DIALOG', this.newDialog)
        }
        this.$store.commit('ACTIVATE_TYPING')
        this.message = ''
        axios.get('/api/conversation/message', {
          params: data
        }).then(response => {
          this.processMessage(response)
        }).catch(err => {
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
          } else if (err.request) {
            // The request was made but no response was received
            // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(err.request)
          } else {
            // Something happened in setting up the request that triggered an err
            console.log('err', err.message)
          }
          console.log(err.config)
        })
      }
    },
    close () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
    },
    initChat () {
      return new Promise((resolve, reject) => {
        if (!this.$store.getters.getContext) {
          this.$store.commit('ACTIVATE_TYPING')
          axios.get('/api/conversation/init').then(response => {
            this.$store.commit('DEACTIVATE_TYPING')
            this.$store.commit('SET_CONTEXT', response.data.context)
            this.$store.dispatch('LOAD_STATES')
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
        context: this.$store.getters.getContext
      }
      this.$store.commit('ACTIVATE_TYPING')
      axios.get('/api/conversation/message', {
        params: data
      }).then(response => {
        this.$store.commit('DEACTIVATE_TYPING')
        this.$store.commit('SET_CONTEXT', response.data.context)
        response.data.output.text.forEach(text => {
          this.$store.commit('ADD_TEXT', {
            sender: 'watson',
            message: text
          })
        })
      })
    },
    notifySocialMedia () {
      let data = {
        text: this.$store.getters.getAccessSource + ' Access',
        context: Object.assign(this.$store.getters.getContext, {video_query: this.$store.getters.getUser.user_data.like})
      }
      console.log(data)
      this.$store.commit('ACTIVATE_TYPING')
      axios.get('/api/conversation/message', {
        params: data
      }).then(response => {
        this.$store.commit('DEACTIVATE_TYPING')
        response.data.context.userLocation = this.$store.getters.getUser.user_data.location
        this.processMessage(response)
      })
    },
    notifyFirstAccess () {
      let data = {
        text: 'Primeiro acesso',
        context: this.$store.getters.getContext
      }
      this.$store.commit('ACTIVATE_TYPING')
      axios.get('/api/conversation/message', {
        params: data
      }).then(response => {
        this.$store.commit('DEACTIVATE_TYPING')
        response.data.output.text.forEach((text, index) => {
          this.$store.commit('ADD_TEXT', {
            sender: 'watson',
            message: text
          })
        })
        this.$store.commit('ADD_TEXT', {
          type: 'yn_question',
          action: response.data.context.question.action,
          active: true,
          options: response.data.context.question.options ? response.data.context.question.options : {yes: 'Sim', no: 'Não'}
        })
        this.inputBoxEnabled = false
        this.$nextTick(function () {
          response.data.context.question = null
          this.$store.commit('SET_CONTEXT', response.data.context)
        })
      })
    },
    saveProfile () {
      let user = {
        name: this.newUser.name,
        email: this.newUser.email,
        pwd: this.newUser.pwd,
        like: this.newUser.like,
        location: this.newUser.location
      }
      axios.post('/api/profile/save', user).then(() => {
        this.error = false
        this.$store.dispatch('LOGIN').then(() => {
          this.displayLoginBox = false
          let data = {
            text: 'Perfil salvo',
            context: Object.assign(this.$store.getters.getContext, {userLocation: this.$store.getters.getUser.user_data.location})
          }
          console.log(data)
          this.$store.commit('ACTIVATE_TYPING')
          axios.get('/api/conversation/message', {
            params: data
          }).then(response => {
            this.$store.commit('DEACTIVATE_TYPING')
            this.processMessage(response)
          })
        })
      }).catch(err => {
        console.log(err)
        if (err.response) {
          if (err.response.status === 403) {
            this.error.message = 'Email ja está em uso!'
          }
        } else if (err.request) {
          console.log(err.request)
        } else {
          console.log('err', err.message)
        }
      })
    }
  },
  mounted () {
    this.$nextTick().then(() => {
      document.querySelector('.chat-wrapper').scrollIntoView({
        behavior: 'smooth'
      })
      this.initChat().then(res => {
        if (this.$store.getters.getUser.login) {
          if (this.isDenied) {
            this.notifyChatDeniedProfile()
          } else {
            this.notifySocialMedia()
          }
        } else {
          this.notifyFirstAccess()
        }
      }).catch(err => {
        console.log(err)
      })
    })
  }
}
</script>
<style lang="sass">
  @import 'Chat'
</style>
