<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn flat :to="{ path: '/dashboard' }">
          <v-icon left>fa fa-chevron-left</v-icon> Voltar
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <h3 class="display-1">{{ selectedFeature.title }}</h3>
      </v-flex>
      <v-flex xs12>
        <v-toolbar dark tabs>
          <v-text-field prepend-icon="search" label="Buscar" solo-inverted class="mx-3" flat></v-text-field>
          <v-tabs slot="extension" centered v-model="active" slider-color="orange" color="transparent">
            <v-tab v-for="tab in tabs" :key="tab.id">
              {{tab.title}}
            </v-tab>
          </v-tabs>
        </v-toolbar>
        <v-tabs-items v-model="active">
          <v-tab-item v-for="tab in tabs" :key="tab.id">
            <v-data-table :headers="headers" class="elevation-1" no-results-text="Nenhum conteúdo foi encontrado" no-data-text="Nenhum conteúdo foi encontrado">
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
  computed: {
    selectedFeature () {
      return this.$store.getters.getDashboardSelectedFeatures
    }
  },
  data () {
    return {
      active: false,
      headers: [
        {
          text: 'Titulo',
          align: 'left',
          value: 'title'
        },
        {
          text: 'Visualizações',
          align: 'left',
          value: 'views'
        },
        {
          text: 'Tags',
          align: 'left',
          value: 'tags'
        }
      ],
      tabs: {
        videos: {
          id: 1,
          title: 'Videos',
          source: 'videos'
        },
        texts: {
          id: 2,
          title: 'Textos',
          source: 'texts'
        }
      }
    }
  },
  mounted () {
  }
}
</script>