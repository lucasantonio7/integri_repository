<template>
  <div class="logo">
    <!-- <img class="integri-logo" :src="require('@/assets/svg/logo/integri_logo.svg')" alt="Integri Logo">
    <img class="integri-text" :src="require('@/assets/svg/logo/integri.svg')" alt="Integri"> -->
    <router-link to="/">
      <img class="integri-text" :src="require('@/assets/png/logo/integri_logo_nome.png')" alt="Integri">
    </router-link>
  </div>
</template>

<script>
export default {
  components: { }
}
</script>
<style lang="sass">
  @import 'Logo'
</style>
