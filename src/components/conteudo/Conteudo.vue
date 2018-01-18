<template>
  <div class="conteudo">
    <v-card-media :src="require('@/assets/jpg/conteudo-min.jpeg')" height="553px" class="conteudo-mask">
      <v-container grid-list-md fill-height fluid>
        <v-layout align-center justify-center>
        </v-layout>
      </v-container>
    </v-card-media>
    <h4>Coteúdo</h4>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  created () {
    axios('/api/google/videocontent').then(resp => {
      console.log(resp.data)
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>
<style lang="sass">
  @import './Conteudo.scss'
</style>
