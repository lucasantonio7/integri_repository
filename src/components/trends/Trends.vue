<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <h4 class="display-1">Em alta</h4>
      </v-flex>
      <v-flex xs3 v-for="video in videosTrends" :key="video">
        <youtube :video-id="video"></youtube>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios'
export default {
  mounted () {
    axios.get('/api/google/trends').then(response => {
      this.$store.commit('SET_TRENDS', response.data)
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    videosTrends () {
      return this.$store.getters.getTrends
    }
  }
}
</script>
