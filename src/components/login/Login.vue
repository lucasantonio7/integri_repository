<template>
  <div class="login" :class="{'admin': strategy === 'admin'}">
    <v-container>
      <v-layout align-center justify-center>
        <v-flex class="login-box" xs12 md8 lg5>
          <div class="login-box-title">
            <div class="login-feather-detail">
              <img :src="require('@/assets/svg/login/integri_login.svg')" alt="">
            </div>
          </div>
          <form class="login-form" @submit.prevent="login">
            <h3 class="body-2 py-1 pt-3">Se você já possui cadastro, insira suas credenciais abaixo:</h3>
            <div class="input-addon">
              <i class="fa fa-user-o" aria-hidden="true"></i>
              <input type="email" v-model="user.email" placeholder="E-mail" required>
            </div>
            <div class="input-addon">
              <i class="fa fa-lock" aria-hidden="true"></i>
              <input type="password" v-model="user.pwd" placeholder="Senha" required>
            </div>
            <div v-if="error.status" class="animated bounce error-text">
              {{ error.message }}
            </div>
            <div class="login-form-action">
              <v-btn type="submit" class="login-submit" :disabled="!user.email && !user.pwd">Enviar</v-btn>
            </div>
          </form>
          
          <div class="social-media-btns" v-if="strategy !== 'admin'">
            <h3 class="body-2 pb-2">Se você ainda não possui cadastro, escolha uma das opções abaixo:</h3>
            <login-twitter></login-twitter>
            <fbl></fbl>
            <link-to-chat></link-to-chat>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import LoginTwitter from '../login-twitter/LoginTwitter'
import LinkToChat from '../chat-link/ChatLink'
import fbl from '../facebook-login/FacebookLogin'
import axios from 'axios'
export default {
  components: {
    LoginTwitter,
    LinkToChat,
    fbl
  },
  data () {
    return {
      user: {
        email: '',
        pwd: ''
      },
      error: {
        status: false,
        message: ''
      }
    }
  },
  methods: {
    login () {
      axios.post('/signin', {
        email: this.user.email,
        password: this.user.pwd
      }).then(resp => {
        console.log(resp.data)
        if (resp.data.authenticationStatus) {
          if (resp.data.role === 'admin') {
            this.$store.dispatch('LOGIN')
          } else {
            window.location.href = '/'
          }
        } else {
          this.error.status = true
          this.error.message = 'Usuário ou senha incorretos!'
        }
      }).catch(err => {
        console.log(err)
        this.error.status = true
        if (err.response.status === 404) {
          this.error.message = 'Usuário não cadastrado em nossa base de dados!'
        } else if (err.response.status === 401) {
          this.error.message = 'Usuário ou senha incorretos!'
        } else {
          this.error.message = 'Não foi possível realizar o login neste momento, por favor tente mais tarde!'
        }
      })
    }
  },
  props: [
    'strategy'
  ]
}
</script>
<style lang="sass">
  @import './Login'
</style>

