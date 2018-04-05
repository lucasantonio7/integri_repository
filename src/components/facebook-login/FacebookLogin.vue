<template>
  <div class="fb-login" @click="login">
    <div class="brand-block">
      <i class="fa fa-facebook" aria-hidden="true"></i>
    </div>
    <div class="text-block">
      <span class="text-piece">Conecte-se com Facebook</span>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'
export default {
  data () {
    return {
      userObj: null
    }
  },
  methods: {
    login () {
      window.location.href = '/api/facebook/authenticate'
    }
  }
}
</script>
<style lang="sass">
  @import 'FacebookLogin.scss'
</style>
