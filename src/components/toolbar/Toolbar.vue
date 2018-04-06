<template>
  <div>
    <v-toolbar dark :fixed="fixed">
      <v-toolbar-title></v-toolbar-title>
      <logo></logo>
      <v-spacer></v-spacer>
      <!-- <v-menu>
        <v-toolbar-side-icon class="hidden-md-and-up" slot="activator"></v-toolbar-side-icon>
        <v-list class="hidden-md-and-up">
          <v-list-tile-content><v-btn flat block :to="{ path: '/' }">Home</v-btn></v-list-tile-content>
          <v-list-tile-content><v-btn flat block :to="{ path: '/conteudo' }">Conteúdo</v-btn></v-list-tile-content>
          <v-list-tile-content><v-btn flat block :to="{ path: '/facaparte' }">Faça Parte</v-btn></v-list-tile-content>
        </v-list>
      </v-menu> -->
      <v-toolbar-side-icon class="hidden-md-and-up" @click="toggleDrawer" @input="t"></v-toolbar-side-icon>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat :to="{ path: '/' }">Home</v-btn>
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
                  <i class="fa fa-user-circle-o logout-fallback" v-if="!user.user_data.profile_image" aria-hidden="true" slot="activator"></i>
                  <img :src="user.user_data.profile_image" v-if="user.user_data.profile_image" alt="Usuário">
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
    <v-navigation-drawer dark temporary v-model="drawer" absolute>
      <v-list class="pa-1">
        <v-list-tile-content>
          <logo></logo>
        </v-list-tile-content>
        <v-list-tile avatar v-if="user.user_data">
          <v-list-tile-avatar>
            <img :src="user.user_data.profile_image">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="user.user_data.name"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple @click.native="logout">
              <v-icon color="grey lighten-1">fa fa-power-off</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile-content><v-btn flat block :to="{ path: '/' }">Home</v-btn></v-list-tile-content>
        <v-list-tile-content><v-btn flat block :to="{ path: '/conteudo' }">Conteúdo</v-btn></v-list-tile-content>
        <v-list-tile-content><v-btn flat block :to="{ path: '/facaparte' }">Faça Parte</v-btn></v-list-tile-content>
        <v-list-tile-content><v-btn flat block :to="{ path: '/politicas/privacidade' }">Privacidade</v-btn></v-list-tile-content>
        <v-list-tile-content><v-btn flat block :to="{ path: '/politicas/uso' }">Termos de uso</v-btn></v-list-tile-content>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Logo from '../logo/Logo'
export default {
  components: {
    Logo
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    drawer: {
      get () {
        return this.$store.getters.getDrawer
      },
      set (data) {
        this.$store.commit('TOGGLE_DRAWER', data)
      }
    }
  },
  methods: {
    logout () {
      window.location.href = '/api/twitter/logout'
    },
    toggleFixed () {
      this.fixed = !this.fixed
    },
    toggleDrawer () {
      this.$store.commit('TOGGLE_DRAWER')
    },
    t (data) {
      console.log(data)
    }
  },
  data () {
    return {
      menu: false,
      fixed: false
    }
  }
}
</script>
<style lang="sass">
 @import 'Toolbar.scss'
</style>

