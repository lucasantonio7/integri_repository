<template>
  <v-container class="mx-auto content" px-5 py-5 justify-center>
    <v-layout justify-center>
      <v-flex xs12 md10 v-if="!error && !loading">
        <v-container>
          <v-layout row="" wrap="">
            <v-flex xs12 py-5>
              <h2 class="display-2">
                {{ currentText.title }}
              </h2>
            </v-flex>
            <v-flex v-html="currentText.text" class="text-content"></v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>

export default {
  computed: {
    currentText () {
      return this.$store.getters.getSpecificText
    }
  },
  created () {
    this.fetchData()
  },
  data () {
    return {
      loading: false,
      error: false
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$store.dispatch('GET_TEXT_DATA', this.$route.params.id).then(res => {
        this.loading = false
        this.error = false
      }).catch(err => {
        this.loading = false
        this.error = true
        console.log(err)
      })
    }
  }
}
</script>
<style lang="sass">
  @import './TextContent.scss'
</style>

