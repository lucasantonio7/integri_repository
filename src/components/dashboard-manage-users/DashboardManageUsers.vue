<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12="">
        <v-btn flat :to="{ path: '/dashboard' }">
          <v-icon left>fa fa-chevron-left</v-icon> Voltar
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <h3 class="display-1">Gerenciar Usuários</h3>
      </v-flex>
      <v-flex xs12>
        <v-toolbar dark tabs>
          <v-text-field prepend-icon="search" v-model="searchQuery" label="Buscar usuário" solo-inverted class="mx-3" flat @change="search"></v-text-field>
          <v-btn icon v-if="searchQuery" @click="clearQuery">
            <v-icon>clear</v-icon>
          </v-btn>
          <v-tabs slot="extension" centered v-model="active" slider-color="pink accent-2" color="transparent">
            <v-tab v-for="tab in tabs" :key="tab.id" @click="searchUsers(tab)">
              {{tab.title}}
            </v-tab>
          </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="active">
          <v-tab-item v-for="tab in tabs" :key="tab.id">
            <v-data-table :headers="headers" :items="items" :loading="loading" class="elevation-1" no-results-text="Nenhum usuário foi encontrado" no-data-text="Nenhum usuário foi encontrado">
              <v-progress-linear slot="progress" color="pink accent-2" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td>
                  <v-btn icon @click="selectUser(tab.source, props.item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
      <!-- DIALOG -->
      <v-flex xs12>
        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" :max-width="$vuetify.breakpoint.width * 0.65" transition="dialog-bottom-transition">
          <v-toolbar dark>
            <v-btn flat @click="closeModal">
              <v-icon left>fa fa-chevron-left</v-icon> Voltar
            </v-btn>
            <v-toolbar-title>Usuário: {{ selectedUser.name }}</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 v-if="loading">
                    <v-progress-linear color="pink accent-2" indeterminate></v-progress-linear>
                  </v-flex>
                  <v-flex xs12>
                    <h5 class="body-2">Acessos</h5>
                    <v-flex xs12 sm6 md3 v-for="access in featuresIDs" :key="access.id">
                      <v-list two-line subheader>
                        <v-list-tile avatar>
                          <v-list-tile-action>
                            <v-checkbox v-model="selectedUser.access" :value="access.id"></v-checkbox>
                          </v-list-tile-action>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ features[access.id].title }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ features[access.id].description }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="saveChanges">
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  computed: {
    features () {
      return this.$store.getters.getDashboardFeatures
    }
  },
  created () {
    this.searchUsers({source: 'all'})
  },
  data () {
    return {
      active: null,
      dialog: false,
      featuresIDs: [{
        id: 'contentmanagement'
      }, {
        id: 'usersmanagement'
      }, {
        id: 'newsletterssubscriptions'
      }, {
        id: 'sharedcontent'
      }, {
        id: 'curatorship'
      }],
      headers: [
        {
          text: 'Nome',
          align: 'left',
          value: 'name'
        }
      ],
      items: [],
      tabs: {
        all: {
          id: 1,
          title: 'Todos usuários',
          source: 'all'
        },
        facebook: {
          id: 2,
          title: 'Facebook',
          source: 'facebook'
        },
        twitter: {
          id: 3,
          title: 'Twitter',
          source: 'twitter'
        },
        parceiros: {
          id: 4,
          title: 'Integri',
          source: 'integri'
        }
      },
      selectedUser: {
        name: '',
        access: []
      },
      defaultUser: {
        name: '',
        access: []
      },
      searchQuery: ''
    }
  },
  methods: {
    clearQuery () {
      this.searchQuery = null
      this.searchUsers(Object.entries(this.tabs)[this.active][1])
    },
    closeModal () {
      this.dialog = false
      this.selectedUser = this.defaultUser
      this.isDeleting = false
    },
    saveChanges () {
      this.loading = true
      if (this.selectedUser.access.length > 0) {
        this.selectedUser.role = 'curator'
      } else {
        this.selectedUser.role = null
      }
      this.$store.dispatch('DASHBOARD_SAVE_USER_CHANGES', this.selectedUser).then(res => {
        this.closeModal()
        this.searchUsers(Object.entries(this.tabs)[this.active][1])
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    searchUsers (tab) {
      this.loading = true
      this.$store.dispatch('DASHBOARD_LOAD_USERS', tab.source).then(res => {
        this.items = this.$store.getters.getDashboardUsers
        this.loading = false
      })
    },
    search () {
      this.items = this.items.filter(item => {
        if (item.name.includes(this.searchQuery.trim())) {
          return true
        }
      })
      console.log(this.items)
    },
    selectUser (source, user) {
      this.selectedUser = user
      console.log(user)
      this.dialog = true
    }
  }
}

</script>
<style lang="sass">
</style>
