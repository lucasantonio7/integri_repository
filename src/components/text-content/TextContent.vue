<template>
  <v-container class="mx-auto content" grid-list-xs justify-center>
    <v-layout row wrap justify-center>
      <v-flex xs12 md12 >
        <v-btn flat @click="backToContent">
          <v-icon left>fa fa-chevron-left</v-icon>
          Voltar
        </v-btn>
      </v-flex>
      <v-flex xs12 md10 v-if="!error && !loading">
        <v-container>
          <v-layout row="" wrap="">
            <v-flex xs12 py-5>
              <h2 class="display-2">
                {{ currentText.title }}
              </h2>
            </v-flex>
            <v-flex v-html="currentText.text" class="text-content"></v-flex>
            <v-flex xs12>
              {{ processSource }}
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <v-flex x12 md12 text-xs-right>
        <v-btn fab dark large color="purple" @click="backToTop">
          <v-icon dark>fa fa-chevron-up</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios'
export default {
  computed: {
    currentText () {
      return this.$store.getters.getSpecificText
    },
    processSource () {
      if (this.currentText.source) {
        let matches = this.currentText.source.match(this.expressionURL)
        matches.forEach(match => {
          this.currentText.source = this.currentText.source.replace(match, '<a href="' + match + '">' + match + '</a>')
        })
        return this.currentText.source
      } else {
        return ''
      }
    }
  },
  created () {
    this.fetchData()
    if (this.addView()) {
      axios.post('/api/texts/addview', {id: this.$route.params.id}).then(res => {
        let currentAccess = {}
        let currentDate = new Date()
        currentDate.setHours(currentDate.getHours() + 24)
        currentAccess[this.$route.params.id.toString()] = currentDate.getTime()
        localStorage.setItem('lastaccess', JSON.stringify(currentAccess))
      }).catch(err => {
        console.log(err)
      })
    }
  },
  data () {
    return {
      loading: false,
      error: false,
      storage: null,
      expressionURL: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
    }
  },
  methods: {
    addView () {
      let lastaccess = JSON.parse(localStorage.getItem('lastaccess'))
      if (lastaccess) {
        let currentContent = lastaccess[this.$route.params.id]
        if (currentContent) {
          if (!(currentContent < Date.now())) {
            return false
          }
        }
      }
      return true
    },
    backToContent () {
      this.$router.push('/conteudo')
    },
    backToTop () {
      document.querySelector('.display-2').scrollIntoView({behavior: 'smooth'})
    },
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

