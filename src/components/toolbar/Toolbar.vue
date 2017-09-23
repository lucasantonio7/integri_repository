<template>
  <v-toolbar dark>
    <v-toolbar-title></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-side-icon class="hidden-md-and-up"></v-toolbar-side-icon>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat>Plataforma</v-btn>
      <v-btn flat>Conteúdo</v-btn>
      <v-btn flat>Faça Parte</v-btn>
      <v-avatar v-if="user.login" class="logged-profile-avatar">
        <img :src="user.user_data._json.profile_image_url" alt="Usuário">
      </v-avatar>
    </v-toolbar-items>
  </v-toolbar>
</template>
<script>
  export default {
    computed: {
      user () {
        console.log(this.$store.getters.getUser)
        return this.$store.getters.getUser
      }
    }
  }
</script>
<style lang="sass">
 @import 'Toolbar.scss'
</style>

