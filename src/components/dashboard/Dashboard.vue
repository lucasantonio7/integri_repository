<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 d-flex align-center>
        <h3 class="display-3">Dashboard</h3>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 md3>
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
}
</script>
