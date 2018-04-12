<template>
  <div class="social-twitter" @click="startLogin">
    <div class="brand-block">
      <i class="fab fa-twitter" aria-hidden="true"></i>
    </div>
    <div class="text-block">
      <span class="text-piece">Conecte-se com Twitter</span>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    startLogin () {
      window.location.href = '/api/twitter/login'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'LoginTwitter.scss'
</style>
