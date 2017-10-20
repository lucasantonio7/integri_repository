<template>
  <v-toolbar dark>
    <v-toolbar-title></v-toolbar-title>
    <logo v-show="$route.path==='/' ? false : true"></logo>
    <v-spacer></v-spacer>
    <v-toolbar-side-icon class="hidden-md-and-up"></v-toolbar-side-icon>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat :to="{ path: '/' }">Plataforma</v-btn>
      <v-btn flat :to="{ path: '/conteudo' }">Conteúdo</v-btn>
      <v-btn flat :to="{ path: '/facaparte' }">Faça Parte</v-btn>
      <v-menu offset-x :close-on-content-click="false" :nudge-width="200" v-model="menu" v-if="user.login">
        <v-avatar class="logged-profile-avatar" slot="activator" v-if="user.user_data.profile_image">
          <img :src="user.user_data.profile_image" alt="Usuário">
        </v-avatar>
        <i class="fa fa-user-circle-o user-fallback" aria-hidden="true" v-if="!user.user_data.profile_image" slot="activator"></i>
        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <i class="fa fa-user-circle-o logout-fallback" aria-hidden="true" slot="activator"></i>
                <!-- <img :src="user.user_data.profile_image" alt="Usuário"> -->
              </v-list-tile-avatar>
              
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ user.user_data.name }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="logout">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import Logo from '../logo/Logo'
export default {
  components: {
    Logo
  },
  computed: {
    user () {
      console.log(this.$store.getters.getUser)
      return this.$store.getters.getUser
    }
  },
  methods: {
    logout () {
      window.location.href = '/api/twitter/logout'
    }
  },
  data () {
    return {
      menu: false
    }
  }
}
</script>
<style lang="sass">
 @import 'Toolbar.scss'
</style>

