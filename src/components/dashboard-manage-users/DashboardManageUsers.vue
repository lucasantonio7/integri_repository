<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12="">
        <v-btn flat :to="{ path: '/dashboard' }">
          <v-icon left>fa fa-chevron-left</v-icon> Voltar
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <h3 class="display-1">Gerenciar Usuários</h3>
      </v-flex>
      <v-flex xs12>
        <v-toolbar dark tabs>
          <v-text-field prepend-icon="search" append-icon="mic" label="Search" solo-inverted class="mx-3" flat></v-text-field>
          <v-tabs slot="extension" centered v-model="active" slider-color="orange" color="transparent">
            <v-tab v-for="tab in tabs" :key="tab.id">
              {{tab.title}}
            </v-tab>
          </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="active">
          <v-tab-item v-for="tab in tabs" :key="tab.id">
            <v-data-table :headers="headers" :items="items" class="elevation-1" no-results-text="Nenhum usuário foi encontrado" no-data-text="Nenhum usuário foi encontrado">
              <template slot="items">

              </template>
            </v-data-table>
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
      active: null,
      items: [],
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
      },
      headers: [
        {
          text: 'Nome',
          align: 'left',
          value: 'name'
        }
      ]
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
