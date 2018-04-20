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
      <!-- edit box -->
      <v-flex xs-12>
        <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" :max-width="$vuetify.breakpoint.width * 0.65" transition="dialog-bottom-transition">
          <v-btn color="pink accent-2 ma-0" dark large slot="activator" class="mb-2">
            <v-icon left>fas fa-plus</v-icon>
            Criar novo
          </v-btn>
          <v-toolbar dark>
            <v-btn flat @click="closeModal">
              <v-icon left>fa fa-chevron-left</v-icon> Voltar
            </v-btn>
            <v-toolbar-title>{{ cardTitle }}</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap v-if="!isDeleting">
                  <v-flex xs12 sm6>
                    <v-select
                      :items="itemTypes"
                      item-text="text"
                      item-value="id"
                      v-model="currentItemType"
                      label="Tipo de conteúdo"
                    ></v-select>
                  </v-flex>
                  <!-- Content === video -->
                  <v-flex xs12 v-if="currentItemType === this.tabs.videos.source">
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-text-field label="ID do youtube" placeholder="Aceita ID do vídeo ou URL" v-model="editedItem.id" @change="clearURL"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-select
                            label="Tags"
                            :items="classificationTags"
                            item-value="id"
                            item-text="name"
                            v-model="editedItem.tags"
                            multiple
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 v-if="editedItem.id">
                          <youtube class="responsive-yt" :video-id="editedItem.id" :player-width="$vuetify.breakpoint.width * 0.65 - 80" :player-height="($vuetify.breakpoint.width * 0.65 - 80) / 1.777" @ready="ready" @playing="playing"></youtube>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-flex>
                  <!-- Content === text -->
                  <v-flex xs12 v-if="currentItemType === this.tabs.texts.source">
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-text-field label="Titulo" v-model="editedItem.title"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-select
                            label="Tags"
                            :items="classificationTags"
                            item-value="id"
                            item-text="name"
                            v-model="editedItem.tags"
                            multiple
                          ></v-select>
                        </v-flex>
                        <v-flex xs12>
                          <wysiwyg v-model="editedItem.text" />
                        </v-flex>
                        <v-flex xs12>
                          <p class="subheading">Fonte:</p>
                          <v-text-field v-model="editedItem.source" label="Fonte"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
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
              <v-btn @click="save" :disabled="!validForm" v-if="!isDeleting">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <!-- Table -->
      <v-flex xs12>
        <v-toolbar dark tabs>
          <v-text-field prepend-icon="search" v-model="searchQuery" label="Buscar por ID ou título" solo-inverted class="mx-3" flat @change="search"></v-text-field>
          <v-btn icon v-if="searchQuery" @click="clearQuery">
            <v-icon>clear</v-icon>
          </v-btn>
          <v-tabs slot="extension" centered v-model="active" slider-color="pink accent-2" color="transparent">
            <v-tab v-for="tab in tabs" :key="tab.id" @click="fetchData(tab)">
              {{tab.title}}
            </v-tab>
          </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="active">
          <v-tab-item v-for="tab in tabs" :key="tab.id">
            <v-data-table :headers="tab.headers" :items="items" :loading="loading" class="elevation-1" no-results-text="Nenhum conteúdo foi encontrado" no-data-text="Nenhum conteúdo foi encontrado">
              <v-progress-linear slot="progress" color="pink accent-2" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td v-for="(item, index) in tab.headers" :key="index">{{ item.value === 'tags' ? getTagName(props.item[item.value]) : props.item[item.value] }}</td>
                <td>
                  <v-btn icon @click="editRegister(tab.source, props.item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn icon @click="startDeleting(tab.source, props.item)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
    <router-view></router-view>
  </v-container>
</template>
<script>
export default {
  computed: {
    classificationTags: {
      get () {
        return this.$store.getters.getClassificationTags
      }
    },
    selectedFeature () {
      return this.$store.getters.getDashboardSelectedFeatures
    },
    validForm () {
      if (this.currentItemType === this.tabs.videos.source) {
        // Youtube content
        return this.editedItem.id && this.editedItem.tags.length > 0
      } else if (this.currentItemType === this.tabs.texts.source) {
        // Text content
        return this.editedItem.title && this.editedItem.text && this.editedItem.tags.length > 0
      } else {
        return false
      }
    },
    cardTitle () {
      if (this.currentItemType === this.tabs.videos.source && this.editedItem.id) {
        return this.editedItem.id
      } else if (this.currentItemType === this.tabs.texts.source && this.editedItem.title) {
        return this.editedItem.title
      } else if (this.isDeleting) {
        return 'Deletando ' + (this.editedItem.id || this.editedItem.title)
      } else {
        return 'Novo item de conteúdo'
      }
    }
  },
  created () {
    this.$store.dispatch('LOAD_CLASSIFICATION_TAGS')
    this.fetchData(this.tabs.videos)
  },
  data () {
    return {
      active: '',
      currentItemType: null,
      defaultItem: {
        _id: null,
        id: '',
        channel: '',
        title: '',
        text: '',
        source: '',
        tags: []
      },
      editedItem: {
        _id: null,
        id: '',
        channel: '',
        title: '',
        text: '',
        source: '',
        tags: []
      },
      dialog: false,
      filteredCollection: null,
      isDeleting: false,
      items: [],
      itemTypes: [{
        id: 'videos',
        text: 'Vídeo'
      }, {
        id: 'texts',
        text: 'Texto'
      }],
      loading: false,
      searchQuery: null,
      tabs: {
        videos: {
          id: 1,
          title: 'Vídeos',
          source: 'videos',
          headers: [
            {
              text: 'ID',
              align: 'left',
              value: 'id'
            },
            {
              text: 'Titulo',
              align: 'left',
              value: 'title'
            },
            {
              text: 'Canal',
              align: 'left',
              value: 'channel'
            },
            {
              text: 'Tags',
              align: 'left',
              value: 'tags'
            }
          ]
        },
        texts: {
          id: 2,
          title: 'Textos',
          source: 'texts',
          headers: [
            {
              text: 'Titulo',
              align: 'left',
              value: 'title'
            },
            {
              text: 'Tags',
              align: 'left',
              value: 'tags'
            }
          ]
        }
      }
    }
  },
  methods: {
    confirmDelete () {
      let action = ''
      if (this.currentItemType === this.tabs.videos.source) {
        // Youtube content
        action = 'DASHBOARD_DELETE_CONTENT_VIDEO'
      } else if (this.currentItemType === this.tabs.texts.source) {
        // Text content
        action = 'DASHBOARD_DELETE_CONTENT_TEXT'
      }
      this.$store.dispatch(action, this.editedItem).then(res => {
        this.fetchData(this.tabs[this.currentItemType])
        this.dialog = false
        this.editedItem = this.defaultItem
        this.currentItemType = null
        this.isDeleting = false
      }).catch(err => {
        console.log(err)
      })
    },
    clearURL () {
      this.editedItem.id = this.editedItem.id.replace('https://youtu.be/', '').replace('https://www.youtube.com/watch?v=', '')
    },
    clearQuery () {
      this.searchQuery = null
      this.fetchData(Object.entries(this.tabs)[this.active][1])
    },
    closeModal () {
      this.dialog = false
      this.editedItem = this.defaultItem
      this.currentItemType = null
      this.isDeleting = false
    },
    editRegister (source, data) {
      if (source === this.tabs.videos.source) {
        this.currentItemType = this.tabs.videos.source
      } else if (source === this.tabs.texts.source) {
        this.currentItemType = this.tabs.texts.source
      }
      this.editedItem = data
      this.dialog = true
    },
    fetchData (tab) {
      this.items = []
      this.loading = true
      if (tab.source === this.tabs.videos.source) {
        this.$store.dispatch('LOAD_CONTENT_VIDEOS').then(res => {
          this.items = this.$store.getters.getContentVideos
          this.loading = false
        })
      } else if (tab.source === this.tabs.texts.source) {
        this.$store.dispatch('LOAD_CONTENT_TEXTS').then(res => {
          this.items = this.$store.getters.getContentTexts
          this.loading = false
        })
      } else {
        // Load videos considering that videos is the first item on tabs variable
        this.$store.dispatch('LOAD_CONTENT_VIDEOS').then(res => {
          this.items = this.$store.getters.getContentVideos
          this.loading = false
        })
      }
    },
    getTagName (tags) {
      return tags.map(tag => this.$store.getters.getClassificationTagName(tag)).reduce((prev, next) => prev + ', ' + next)
    },
    playing () {
      // Function to deal with playing video
    },
    startDeleting (source, item) {
      this.dialog = true
      this.isDeleting = true
      this.editedItem = item
      this.currentItemType = source
    },
    ready (player) {
      this.player = player
    },
    save () {
      let payload = null
      let action = ''
      if (this.currentItemType === this.tabs.videos.source) {
        // Youtube content
        action = 'DASHBOARD_SAVE_CONTENT_VIDEO'
        payload = {
          id: this.editedItem.id,
          tags: this.editedItem.tags
        }
      } else if (this.currentItemType === this.tabs.texts.source) {
        // Text content
        action = 'DASHBOARD_SAVE_CONTENT_TEXT'
        payload = {
          _id: this.editedItem._id,
          title: this.editedItem.title,
          text: this.editedItem.text,
          tags: this.editedItem.tags,
          source: this.editedItem.source
        }
      }
      this.$store.dispatch(action, payload).then(res => {
        this.editedItem = this.defaultItem
        this.fetchData(this.tabs[this.currentItemType])
      }).catch(err => {
        console.log(err)
      })
    },
    search () {
      this.items = this.items.filter(item => {
        if (item.title.includes(this.searchQuery.trim())) {
          return true
        } else if (item.id === this.searchQuery.trim()) {
          return true
        }
      })
      console.log(this.items)
    }
  }
}
</script>
<style lang="sass">
  @import 'DashboardManageContent'
  @import '~vue-wysiwyg/dist/vueWysiwyg.css'
</style>