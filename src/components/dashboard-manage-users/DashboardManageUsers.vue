<template>
  <v-container>
    <v-layout>
      <v-flex xs-12>
        <h3 class="display-1">Gerenciar Usuários</h3>
      </v-flex>
      <v-flex xs12>
        <v-toolbar dark tabs>
          <v-text-field prepend-icon="search" append-icon="mic" label="Search" solo-inverted class="mx-3" flat></v-text-field>
          <v-tabs slot="extension" centered v-model="tabs" slider-color="white" color="transparent">
            <v-tab v-for="tab in tabs" :key="tab.id">
              {{tab.title}}
            </v-tab>
          </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="tabs">
          <v-tab-item v-for="tab in tabs" :key="tab.id">
            <v-card flat>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  computed: {},
  data () {
    return {
      tabs: {
        all: {
          id: 1,
          title: 'Todos usuários',
          command: 'all'
        },
        facebook: {
          id: 2,
          title: 'Facebook',
          command: 'facebook'
        },
        twitter: {
          id: 3,
          title: 'Twitter',
          command: 'twitter'
        },
        parceiros: {
          id: 4,
          title: 'Parceiros',
          command: 'parceiros'
        }
      }
    }
  },
  methods: {
    searchUserType () {
    }
  }
}

</script>
<style lang="sass">
</style>
