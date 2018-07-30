<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
  }
</script>
<style lang="sass">
  @import './Dashboard.scss'
</style>
