<template>
  <div class="conteudo">
    <v-card-media :src="require('@/assets/jpg/conteudo-min.jpeg')" height="553px" class="conteudo-mask">
      <v-container grid-list-md fill-height fluid>
        <v-layout align-center justify-center row>
          <v-flex xs2 v-for="(tag, index) in tagsValues" :key="index"> 
            <p>#{{tag.title}}</p>
            <vue-slider v-model="tag.value" v-bind="slidersOptions" :lazy="true"></vue-slider>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-media>
    <v-container grid-list-md fill-height fluid>
      <v-layout align-center justify-center row wrap>
        <v-flex xs12>
          <h4 class="title py-4 px-2">Seu conteúdo</h4>
        </v-flex>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex class="video-card" d-flex xs6 md4 v-for="video in taggedVideos" :key="video.id" @click="showModal(video)">
              <v-card>
                <img class="video-thumbnail" :src="video.thumbnail.url">
                <v-card-text>
                  <p>{{ video.title }}</p>
                  <p>Visualizações: {{ video.views }} <v-icon>fa fa-eye</v-icon></p>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-container>
    <v-dialog v-model="showVideo" persistent :max-width="currentVideo.thumbnail.width" :width="currentVideo.thumbnail.width">
      <div class="floating-video">
        <span class="close-btn" @click="closeModal"><i class="fa fa-chevron-left" aria-hidden="true"></i>Voltar</span>
        <youtube :video-id="currentVideo.id" :player-vars="{ autoplay: 1 }" :player-width="currentVideo.thumbnail.width" :player-height="currentVideo.thumbnail.height" class="responsive-yt" @ready="ready" @playing="playing"></youtube>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
export default {
  components: {
    vueSlider
  },
  computed: {
    videos () {
      return this.$store.getters.getContentVideos
    },
    taggedVideos () {
      let totalVideos = this.videos.length
      // Link videos with their tags
      let tagsList = []
      for (let prop in this.tagsValues) {
        let selectedVideos = this.videos.filter(item => {
          return item.tags.some(tag => {
            if (tag === this.tagsValues[prop].title) {
              return true
            }
          })
        })
        this.tagsValues[prop].videos = selectedVideos
        tagsList.push(this.tagsValues[prop])
      }
      console.log(tagsList)
      tagsList = tagsList.sort((first, second) => {
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
      let finalResult = []
      while (finalResult.length < totalVideos) {
        for (let j = 0; j < tagsList.length; j++) {
          let ratio = tagsList[j].value - 50
          let backwards = false
          ratio = Math.round(ratio)
          if (ratio <= 0) {
            ratio = 1
            backwards = true
          }
          for (let i = 0; i < ratio; i++) {
            if (tagsList[j].videos.length < 1) {
              break
            }
            if (backwards) {
              finalResult.push(tagsList[j].videos.pop())
            } else {
              finalResult.push(tagsList[j].videos.shift())
            }
          }
          if (tagsList[j].videos.length < 1) {
            tagsList.splice(j, 1)
          }
        }
      }
      console.log(finalResult)
      return finalResult
    }
  },
  data () {
    return {
      showVideo: false,
      isSliding: false,
      currentVideo: {
        active: false,
        id: '',
        thumbnail: {
          width: '',
          height: '',
          url: ''
        }
      },
      tagsValues: {
        education: {
          title: 'Educação',
          value: 50,
          videos: []
        },
        inspiration: {
          title: 'Inspiração',
          value: 50,
          videos: []
        },
        sustainability: {
          title: 'Sustentabilidade',
          value: 50,
          videos: []
        },
        volunteering: {
          title: 'Voluntariado',
          value: 50,
          videos: []
        },
        health: {
          title: 'Saúde',
          value: 50,
          videos: []
        },
        socialResponsibility: {
          title: 'Responsabilidade Social',
          value: 50,
          videos: []
        }
      },
      slidersOptions: {
        width: 4,
        height: 350,
        dotSize: 22,
        min: 0,
        max: 100,
        direction: 'vertical',
        tooltipDir: 'right'
      }
    }
  },
  methods: {
    closeModal () {
      this.player.stopVideo()
      this.showVideo = false
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
    }
  }
}
</script>
<style lang="sass">
  @import './Conteudo.scss'
</style>
