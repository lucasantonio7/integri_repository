<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn class="pa-0 ma-0" flat :to="{ path: '/dashboard' }">
          <v-icon left>fa fa-chevron-left</v-icon> Voltar
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <h3 class="headline py-2">{{ selectedFeature.title }}</h3>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="items" class="elevation-1" no-results-text="Nenhuma inscrição encontrada" no-data-text="Não há nenhuma inscrição">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex xs12>
        <download-excel
            class="btn btn-default"
            :data="items"
            :fields="json_fields"
            :meta="json_meta"
            name="newsletter.xls">
            Gerar Planilha
        </download-excel>
        <!-- <v-btn class="ma-0" @click="generateXLS">
          Gerar planilha
        </v-btn> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import JsonExcel from 'vue-json-excel'
export default {
  components: {
    'downloadExcel': JsonExcel
  },
  computed: {
    selectedFeature () {
      return this.$store.getters.getDashboardSelectedFeatures
    },
    items () {
      console.log(this.$store.getters.getNewsletterSubscribers)
      return this.$store.getters.getNewsletterSubscribers
    }
  },
  data () {
    return {
      headers: [
        {
          text: 'Email',
          align: 'left',
          value: 'id'
        }
      ],
      json_fields: {
        'Email': 'id'
      },
      json_meta: [
        [
          {
            'key': 'charset',
            'value': 'utf-8'
          }
        ]
      ]
    }
  },
  methods: {
    dtFormat (timestamp) {
      return this.$moment(timestamp).format('DD/MM/YYYY - HH:mm')
    }
  },
  mounted () {
    this.$store.dispatch('GET_NEWSLETTER_SUBSCRIPTIONS')
  }
}
</script>

