<template>
  <div class="policy">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h3 class="display-1 py-3">{{ policy.title }}</h3>
          <p class="body-1 px-3 py-2" v-for="(text, index) in policy.text" :key="index">{{ text }}</p>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  created () {
    axios('/api/sources/privacy').then(res => {
      if (res.data.title && res.data.text) {
        this.$store.commit('SET_POLICY', res.data)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    policy () {
      return this.$store.getters.getPolicy
    }
  }
}
</script>
