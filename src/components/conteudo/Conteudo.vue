<template>
  <div class="conteudo">
    <div v-if="!loading">
      <v-card-media :src="require('@/assets/jpg/conteudo-min.jpeg')" :height="slidersWrapperHeight" width="100vw" class="conteudo-mask">
      <v-container grid-list-xs text-xs-center fill-height="">
        <v-layout row wrap>
          <v-flex xs12>
            <h3 class="white--text" :class="{'headline': $vuetify.breakpoint.mdAndUp, 'body-2': $vuetify.breakpoint.smAndDown}">Mova as categorias para cima e para baixo para refinar os resultados de conteúdo abaixo.</h3>
          </v-flex>
          <v-flex xs12>
            <v-container :class="{'all-sliders-wrapper': $vuetify.breakpoint.smAndDown}" pb-0 pt-1 v-resize="onResize">
              <v-layout row :style="layoutWidth" v-resize="onResize">
                <v-flex xs4 md2 v-for="(tag, index) in classificationTags" :key="index" class="slider-wrapper" align-center fill-height>
                  <vue-slider v-model="tag.value" v-bind="slidersOptions" :lazy="true">
                    <template slot="tooltip">
                      <div class="custom-tooltip">
                        <p class="text-xs-center white--text" :class="{'headline': $vuetify.breakpoint.mdAndUp, 'body-2': $vuetify.breakpoint.smAndDown}">#{{tag.name}}</p>
                      </div>
                    </template>
                  </vue-slider>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
          <v-flex xs12>
            <h3 class="caption white--text" v-if="$vuetify.breakpoint.smAndDown">Deslize para os lados para ver as outras oções de filtro</h3>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-media>
    <v-container grid-list-md fill-height fluid>
      <v-layout align-center justify-center row wrap>
        <v-flex xs12>
          <h4 class="display-1 py-4 px-2">Seu conteúdo</h4>
        </v-flex>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex class="video-card" d-flex xs12 v-bind:md4="index < 3" v-bind:md3="index < 7" md2 v-for="(content, index) in sortedContent" :key="content._id">
              <v-card v-if="!content.type">
                <div @click="showModal(content)">
                  <img v-if="content.thumbnail" class="video-thumbnail" :src="content.thumbnail.url">
                  <v-card-text>
                    <p>{{ content.title }}</p>
                    <!-- <p>Visualizações: {{ content.views }} <v-icon>fa fa-eye</v-icon></p> -->
                    <p>Tags: <v-chip v-for="(tag, index) in content.tags" :key="index"><v-avatar><v-icon>fa fa-hashtag</v-icon></v-avatar>{{ getTagName(tag) }}</v-chip></p>
                  </v-card-text>
                </div>
              </v-card>
              <v-card v-if="content.type">
                <div @click="showText(content)">
                  <img class="video-thumbnail" :src="require('@/assets/svg/content/thumb_texto.svg')" alt="Texto">
                  <v-card-text>
                    <p>{{ content.title }}</p>
                    <!-- <p>Visualizações: {{ content.views }} <v-icon>fa fa-eye</v-icon></p> -->
                    <p>Tags: <v-chip v-for="(tag, index) in content.tags" :key="index"><v-avatar><v-icon>fa fa-hashtag</v-icon></v-avatar>{{ getTagName(tag) }}</v-chip></p>
                  </v-card-text>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-container>
    </div>
    <v-container grid-list-xs text-xs-center justify-center v-if="loading">
      <v-layout row wrap >
        <v-flex py-5>
          <h3 class="title">Aguarde um momento estamos buscando conteúdo</h3>
          <v-progress-circular py-3 indeterminate :size="300" :width="5" color="purple"></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="showVideo" persistent :fullscreen="$vuetify.breakpoint.smAndDown" :max-width="currentVideoDimensions.width" :width="currentVideoDimensions.width">
      <div class="floating-video">
        <span class="close-btn" @click="closeModal"><i class="fa fa-chevron-left" aria-hidden="true"></i>Voltar</span>
        <youtube :video-id="currentVideo.id" :player-vars="{ autoplay: 1 }" :player-width="currentVideoDimensions.width" :player-height="currentVideoDimensions.height" class="responsive-yt" @ready="ready" @playing="playing"></youtube>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import _ from 'lodash'
export default {
  components: {
    vueSlider
  },
  computed: {
    classificationTags: {
      get () {
        return this.$store.getters.getClassificationTags
      }
    },
    currentWidth () {
      return window.innerWidth
    },
    currentVideoDimensions () {
      if (this.$vuetify.breakpoint.smAndDown) {
        return {
          width: this.currentWidth,
          height: (this.currentWidth / 16) * 9
        }
      } else {
        if (this.currentVideo.thumbnail.width < 640) {
          return {
            width: this.currentWidth * 0.5,
            height: ((this.currentWidth / 2) / 16) * 9
          }
        } else {
          return this.currentVideo.thumbnail
        }
      }
    },
    videos () {
      return this.$store.getters.getContentVideos
    },
    texts () {
      return this.$store.getters.getContentTexts
    },
    imageHeight () {
      return (window.innerHeight / 16) * 9
    },
    sortedContent () {
      let finalResult = []
      this.sortedTags.forEach(tag => {
        let filtered = this.contentSource.filter(content => {
          if (content.tags.some(t => {
            return t === tag.id
          })) {
            if (content.tags.length === 1) {
              return true
            } else {
              if (this.isTheHighestTag(content.tags, tag)) {
                return true
              } else {
                return false
              }
            }
          }
        })
        finalResult = finalResult.concat(filtered)
      })
      return finalResult
    },
    sortedTags () {
      let tags = _.clone(this.$store.getters.getClassificationTags)
      tags = tags.sort((first, second) => {
        let comparison = 0
        let item1 = parseInt(first.value)
        let item2 = parseInt(second.value)
        if (item1 === item2) {
          comparison = 0
        } else if (item1 > item2) {
          comparison = 1
        } else {
          comparison = -1
        }
        return comparison * -1
      })
      return tags
    },
    contentSource () {
      return this.$store.getters.getContentVideos.concat(this.$store.getters.getContentTexts).sort((first, second) => {
        let comparison = 0
        let item1 = parseInt(first.views)
        let item2 = parseInt(second.views)
        if (item1 === item2) {
          comparison = 0
        } else if (item1 > item2) {
          comparison = 1
        } else {
          comparison = -1
        }
        return comparison * -1
      })
    }
  },
  created () {
    this.fetchData()
    this.onResize()
  },
  watch: {
    '$route': 'fetchData'
  },
  data () {
    return {
      showVideo: false,
      isSliding: false,
      layoutWidth: '',
      currentVideo: {
        active: false,
        id: '',
        thumbnail: {
          width: '',
          height: '',
          url: ''
        }
      },
      loading: false,
      error: false,
      slidersWrapperHeight: '',
      slidersOptions: {
        width: 2,
        height: 500,
        dotSize: 22,
        min: 0,
        max: 100,
        direction: 'vertical',
        tooltipDir: 'top',
        bgStyle: {
          backgroundColor: '#C4420422'
        },
        sliderStyle: {
          backgroundColor: '#61217D'
        },
        processStyle: {
          backgroundColor: '#61217D'
        }
      }
    }
  },
  methods: {
    closeModal () {
      this.player.stopVideo()
      this.showVideo = false
    },
    fetchData () {
      let queue = []
      this.loading = true
      this.error = false
      queue.push(this.$store.dispatch('LOAD_CLASSIFICATION_TAGS'))
      queue.push(this.$store.dispatch('LOAD_CONTENT_VIDEOS'))
      queue.push(this.$store.dispatch('LOAD_CONTENT_TEXTS'))
      Promise.all(queue).then(res => {
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.error = true
      })
    },
    onResize () {
      let elementratio = 0
      if (this.currentWidth < 960) {
        elementratio = this.currentWidth * 0.5
        this.layoutWidth = 'width:' + (this.classificationTags.length * elementratio) + 'px'
        this.slidersWrapperHeight = (window.innerHeight - 92) + 'px'
        this.slidersOptions.height = window.innerHeight * 0.6314465408805031
      } else {
        this.layoutWidth = ''
        this.slidersWrapperHeight = '600px'
        this.slidersOptions.height = 500
      }
    },
    // Smaller index means greater importance
    isTheHighestTag (tagset, currentTag) {
      let tagsIndexes = []
      tagset.forEach(tag => {
        tagsIndexes.push(this.sortedTags.findIndex(elem => {
          return elem.id === tag
        }))
      })
      let min = tagsIndexes.reduce((index1, index2) => {
        return Math.min(index1, index2)
      })
      let currentTagIndex = this.sortedTags.findIndex(elem => {
        return elem.id === currentTag.id
      })
      return min === currentTagIndex
    },
    playing (player) {
      // The player is playing a video.
    },
    ready (player) {
      this.player = player
    },
    showModal (video) {
      this.currentVideo.thumbnail = video.thumbnail
      this.currentVideo.id = video.id
      this.showVideo = true
    },
    showText (text) {
      this.$router.push({path: `texto/${text._id}`})
    },
    getTagName (tag) {
      return this.$store.getters.getClassificationTagName(tag)
    }
  }
}
</script>
<style lang="sass">
  @import './Conteudo.scss'
</style>
