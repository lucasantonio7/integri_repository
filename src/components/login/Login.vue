<template>
  <div class="login">
    <v-container>
      <v-layout align-center justify-center>
        <v-flex class="login-box" xs12 md8 lg5>
          <div class="login-box-title">
            <div class="login-feather-detail">
              <img :src="require('@/assets/svg/login/integri_login.svg')" alt="">
            </div>
          </div>
          <form class="login-form">
            <div class="input-addon">
              <i class="fa fa-user-o" aria-hidden="true"></i>
              <input type="email" v-model="user.email" placeholder="E-mail" required>
            </div>
            <div class="input-addon">
              <i class="fa fa-lock" aria-hidden="true"></i>
              <input type="password" v-model="user.pwd" placeholder="Senha" required>
            </div>
            <div class="login-form-action">
              <v-btn type="submit" class="login-submit">Enviar</v-btn>
            </div>
          </form>
          <div class="social-media-btns">
            <login-twitter></login-twitter>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import LoginTwitter from '../login-twitter/LoginTwitter'
export default {
  components: {
    LoginTwitter
  },
  data () {
    return {
      user: {
        email: '',
        pwd: ''
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="sass">
  @import './Login'
</style>

