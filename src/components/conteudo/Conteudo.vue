<template>
  <div class="conteudo">
    <v-card-media :src="require('@/assets/jpg/conteudo-min.jpeg')" height="553px" class="conteudo-mask">
      <v-container grid-list-md fill-height fluid>
        <v-layout align-center justify-center row>
          <v-flex xs2 v-for="(tag, index) in tags" :key="index"> 
            <p>#{{tag.title}}</p>
            <vue-slider v-model="tag.value" v-bind="slidersOptions"></vue-slider>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-media>
    <v-container grid-list-md fill-height fluid>
      <v-layout align-center justify-center row wrap>
        <v-flex xs12>
          <h4>Conteudo</h4>
        </v-flex>
        <v-flex v-for="video in videos" :key="video.id" @click="showModal(video)">
          <v-card>
            <v-card-text>{{ JSON.parse(video.thumbnail) }}</v-card-text>
          </v-card>
        </v-flex>
        <!-- <v-flex class="video-card" xs6 sm3 v-for="video in videos" :key="video.id" @click="showModal(video)">
          <v-card>
            <img class="video-thumbnail" :src="video.thumbnail.url" alt="">
            <v-card-text>{{ video.title }}</v-card-text>
          </v-card>
        </v-flex> -->
      </v-layout>
    </v-container>
    <!-- <v-dialog v-model="showVideo" persistent :max-width="currentVideo.thumbnail.width" :width="currentVideo.thumbnail.width">
      <div class="floating-video">
        <span class="close-btn" @click="closeModal"><i class="fa fa-chevron-left" aria-hidden="true"></i>Voltar</span>
        <youtube :video-id="currentVideo.id" :player-vars="{ autoplay: 1 }" :player-width="currentVideo.thumbnail.width" :player-height="currentVideo.thumbnail.height" class="responsive-yt" @ready="ready"></youtube>
      </div>
    </v-dialog> -->
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
export default {
  created () {
    this.$store.dispatch('LOAD_CONTENT_VIDEOS')
  },
  components: {
    vueSlider
  },
  computed: {
    videos () {
      return this.$store.getters.getContentVideos
    }
  },
  data () {
    return {
      showVideo: null,
      currentVideo: {
        id: null,
        thumbnail: null
      },
      tags: {
        education: {
          title: 'Educação',
          value: 0
        },
        inspiration: {
          title: 'Inspiração',
          value: 0
        },
        sustainability: {
          title: 'Sustentabilidade',
          value: 0
        },
        volunteering: {
          title: 'Voluntariado',
          value: 0
        },
        health: {
          title: 'Saúde',
          value: 0
        },
        socialResponsibility: {
          title: 'Responsabilidade Social',
          value: 0
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
