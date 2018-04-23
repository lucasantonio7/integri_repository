<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn flat :to="{ path: '/dashboard' }">
          <v-icon left>fa fa-chevron-left</v-icon> Voltar
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <h3 class="display-1">{{ selectedFeature.title }}</h3>
      </v-flex>
      <v-flex xs12>
        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" :max-width="$vuetify.breakpoint.width * 0.65" transition="dialog-bottom-transition">
          <v-toolbar dark>
            <v-btn flat @click="closeModal">
              <v-icon left>fa fa-chevron-left</v-icon> Voltar
            </v-btn>
            <v-toolbar-title>Conteúdo criado por: {{ selectedSharedContent.author }} em {{ dtFormat(selectedSharedContent.created) }}</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-container>
                <v-layout row wrap v-if="!isDeleting">
                  <v-flex xs12 >
                    <blockquote>
                      {{ selectedSharedContent.content }}
                    </blockquote>
                  </v-flex>
                </v-layout>
                <v-layout row wrap v-if="isDeleting">
                  <v-flex xs12 md10>
                    <p class="title text-xs-center">Deseja realmente deletar? Esse registro não pode ser recuperado posteriormente</p>
                  </v-flex>
                  <v-flex md2>
                    <v-avatar class="white levi" tile size="100">
                      <img :src="require('@/assets/png/logo/triste.png')" alt="">
                    </v-avatar>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="confirmDelete" v-if="isDeleting">
                Deletar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="items" :loading="loading" class="elevation-1" no-results-text="Nenhum conteúdo foi encontrado" no-data-text="Nenhum conteúdo foi encontrado">
          <v-progress-linear slot="progress" color="pink accent-2" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <td>
              {{ props.item.email }}
            </td>
            <td class="ellipsis-content">
              <v-flex xs4>
                {{ props.item.data }}
              </v-flex>
            </td>
            <td>
              {{ dtFormat(props.item.created) }}
            </td>
            <td>
              <v-btn icon @click="viewRegister(props.item)">
                <v-icon>fas fa-eye</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn icon @click="startDeleting(props.item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  computed: {
    items () {
      return this.$store.getters.getDashboardSharedContentList
    },
    selectedFeature () {
      return this.$store.getters.getDashboardSelectedFeatures
    }
  },
  created () {
    this.fetchData()
  },
  data () {
    return {
      dialog: false,
      headers: [
        {
          text: 'Autor',
          align: 'left',
          value: 'email'
        },
        {
          text: 'Conteúdo',
          align: 'left',
          value: 'data'
        },
        {
          text: 'Data da postagem',
          align: 'left',
          value: 'created'
        }
      ],
      isDeleting: false,
      default: {
        author: '',
        content: '',
        created: null
      },
      selectedSharedContent: {
        author: '',
        content: '',
        created: null
      },
      loading: false
    }
  },
  methods: {
    closeModal () {
      this.dialog = false
      this.selectedSharedContent = this.default
      this.isDeleting = false
    },
    confirmDelete () {
      this.$store.dispatch('DASHBOARD_DELETE_SHARED_CONTENT', this.selectedSharedContent).then(res => {
        this.fetchData()
        this.dialog = false
        this.selectedSharedContent = this.default
        this.isDeleting = false
      }).catch(err => {
        console.log(err)
      })
    },
    dtFormat (timestamp) {
      return this.$moment(timestamp).format('DD/MM/YYYY - HH:mm')
    },
    fetchData () {
      this.loading = true
      this.$store.dispatch('DASHBOARD_GET_SHARED_CONTENT').then(res => {
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    startDeleting (selected) {
      this.isDeleting = true
      this.viewRegister(selected)
    },
    viewRegister (selected) {
      this.selectedSharedContent._id = selected._id
      this.selectedSharedContent.author = selected.email
      this.selectedSharedContent.created = selected.created
      this.selectedSharedContent.content = selected.data
      this.dialog = true
    }
  }
}
</script>
<style lang="sass">
 @import 'DashboardSharedContent'
</style>
