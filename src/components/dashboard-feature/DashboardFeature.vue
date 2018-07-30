<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 d-flex align-center>
        <h3 class="display-1 pa-3">Dashboard</h3>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap py-3>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 md6 lg3 pa-1 my-1 v-for="(feature, index) in features" :key="index" class="feature" @click="openFeature(feature)">
            <v-layout align-center justify-center row>
              <v-flex class="feature-thumb">
                <v-avatar size="70" class="border">
                  <v-icon>{{ feature.icon }}</v-icon>
                </v-avatar>
              </v-flex>
              <v-flex py-1>
                <span class="title">{{ feature.title }}</span>
                <p class="caption">{{ feature.description }}</p>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    computed: {
      features () {
        return this.$store.getters.getDashboardFeatures
      }
    },
    methods: {
      openFeature (feature) {
        if (feature.url) {
          this.$store.commit('SET_SELECTED_FEATURE', feature)
          this.$router.push({ name: feature.url })
        }
      }
    }
  }
</script>
<style lang="sass">
  @import './DashboardFeature.scss'
</style>
