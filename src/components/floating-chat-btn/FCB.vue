<template>
  <div class="fbc" @click="toggle">
    <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="">
  </div>
</template>
<script>
export default {
  methods: {
    toggle () {
      this.$store.commit('TOGGLE_CHAT_VISIBILITY')
    }
  }
}
</script>

<style lang="sass">
  @import './FBC'
</style>
