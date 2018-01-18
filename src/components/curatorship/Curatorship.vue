<template>
  <v-container class="curatorship">
    <v-layout row wrap>
      <v-flex xs12>
        <v-tabs v-model="active" dark slider-color="orange" fixed-tabs grow>
          <v-tab v-for="tab in tabs" :key="tab.id" ripple :href="'#' + tab.id">
            {{ tab.title }}
          </v-tab>
          <v-tab-item id="tab1">
            <v-card flat>
              <v-list two-line subheader>
                <template v-for="msg in unseen">
                  <v-list-tile :key="msg.id" @click="view">
                    <v-list-tile-content>
                      <v-list-tile-title>Dialogo: {{ msg.id }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ msg.captured | moment('DD/MM/YYYY - HH:mm')}}</v-list-tile-sub-title>
                    </v-list-tile-content>                  
                  </v-list-tile>
                  <v-divider :key="msg.id"></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tab2">
            <v-card flat>
              <v-list two-line subheader>
                <v-card v-for="msg in pending" :key="msg.id" @click="view">
                  <v-container fluid grind-list-lg>
                    <v-layout row>
                      <v-flex xs12 md3>
                        <v-card-title primaly-title>
                          <div>
                            <h3 class="subheading mb-1">Dialogo: {{ msg.id }}</h3>
                            <h5 class="body-1">{{ msg.captured | moment('DD/MM/YYYY - HH:mm') }}</h5>
                            <h6 class="caption">{{ msg.responsible }}</h6>
                          </div>
                        </v-card-title>
                      </v-flex>
                      <v-flex xs12 md8>
                        <v-chip color="" text-color="white">
                          <v-avatar>
                            <v-icon>fa fa-clock-o</v-icon>
                          </v-avatar>
                          {{ msg.captured | moment('DD/MM/YYYY - HH:mm')}}
                        </v-chip>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-divider></v-divider>
                </v-card>
              </v-list>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tab3">
            <v-card flat>
              <v-list two-line subheader>
                <template v-for="msg in finished">
                  <v-list-tile :key="msg.id" @click="view">
                    <v-list-tile-content>
                      <v-list-tile-title>Dialogo: {{ msg.id }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ msg.captured | moment('DD/MM/YYYY - HH:mm') }}</v-list-tile-sub-title>
                      <v-list-tile-sub-title>{{ msg.responsible }}</v-list-tile-sub-title>
                    </v-list-tile-content>                  
                  </v-list-tile>
                  <v-divider :key="msg.id"></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      active: null,
      tabs: [
        {id: 'tab1', title: 'Não Visualizadas'},
        {id: 'tab2', title: 'Pendentes'},
        {id: 'tab3', title: 'Finalizados'}
      ],
      unseen: [
        {id: 1123131233, messages: [], captured: 1516041144},
        {id: 2231231321, messages: [], captured: 1516041144},
        {id: 3213321321, messages: [], captured: 1516044045},
        {id: 4612321321, messages: [], captured: 1516044078}
      ],
      pending: [
        {id: 1123131233, messages: [], captured: 1516041144, responsible: 'Alguma pessoa'},
        {id: 2231231321, messages: [], captured: 1516041144, responsible: 'Alguma pessoa'},
        {id: 3213321321, messages: [], captured: 1516044045, responsible: 'Alguma pessoa'},
        {id: 4612321321, messages: [], captured: 1516044078, responsible: 'Alguma pessoa'}
      ],
      finished: [
        {id: 1123131233, messages: [], captured: 1516041144, responsible: 'Alguma pessoa'},
        {id: 2231231321, messages: [], captured: 1516041144, responsible: 'Alguma pessoa'},
        {id: 3213321321, messages: [], captured: 1516044045, responsible: 'Alguma pessoa'},
        {id: 4612321321, messages: [], captured: 1516044078, responsible: 'Alguma pessoa'}
      ]
    }
  },
  methods: {
    setTab (tab) {
      this.active = tab
    },
    view () {}
  },
  created () {
    console.log(this.$moment(1516041144272).utc())
  }
}
</script>
<style lang="scss">
  @import './Curatorship.scss'
</style>