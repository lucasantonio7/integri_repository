<template>
  <v-container class="curatorship">
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar dark>
          <v-text-field 
            prepend-icon="search"
            label="Buscar"
            solo-inverted
            class="mx-3"
            flat
            @keyup.enter="search"
            v-model="searchQuery"
            single-line
          ></v-text-field>
          <v-btn icon v-if="searchQuery" @click="searchQuery = ''">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-toolbar>
        <v-tabs v-model="active" dark slider-color="orange" fixed-tabs grow>
          <v-tab v-for="tab in tabs" :key="tab.id" ripple :href="'#' + tab.id" @click="fetchData(tab)">
            {{ tab.title }}
          </v-tab>
          <v-tab-item id="unseen">
            <v-card flat>
              <v-list two-line subheader>
                <template v-for="msg in unseen">
                  <v-list-tile :key="msg._id" @click="view(msg)">
                    <v-list-tile-content>
                      <v-list-tile-title>Dialogo: {{ msg._id }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ dtFormat(msg.captured) }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="msg.id"></v-divider>
                </template>
              </v-list>
              <v-jumbotron v-if="!isValidUnseenDialogs">
                <v-container fill-height>
                  <v-layout align-center>
                    <v-flex>
                      <h3 class="display-3">Nenhum diálogo até o momento</h3>
                      <span class="subheading">No momento não há nenhum diálogo aguardando revisão.</span>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-jumbotron>
            </v-card>
          </v-tab-item>
          <v-tab-item id="pending">
            <v-card flat v-if="pending">
              <v-card v-for="msg in pending" :key="msg._id">
                <v-container fluid grind-list-lg @click="view(msg)">
                  <v-layout row>
                    <v-flex xs12 md3>
                      <v-card-title primaly-title>
                        <div>
                          <h3 class="subheading mb-1">Dialogo: {{ msg._id }}</h3>
                          <h5 class="body-1">{{ dtFormat(msg.captured) }}</h5>
                          <h6 class="caption">{{ msg.responsible.name }} - {{ msg.responsible.email }}</h6>
                        </div>
                      </v-card-title>
                    </v-flex>
                    <v-flex xs12 md8>
                      <h5 class="caption">Data estipulada da entrega:</h5>
                      <v-chip :color="deadline(msg.due_date)" text-color="">
                        <v-avatar>
                          <v-icon>fa fa-clock-o</v-icon>
                        </v-avatar>
                        {{ dtFormat(msg.due_date) }}
                      </v-chip>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-divider></v-divider>
              </v-card>
            </v-card>
            <v-jumbotron v-if="!isValidPendingDialogs">
              <v-container fill-height>
                <v-layout align-center>
                  <v-flex>
                    <h3 class="display-3">Nenhum diálogo até o momento</h3>
                    <span class="subheading">No momento não há nenhum diálogo pendente de revisão dos curadores.</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-jumbotron>
          </v-tab-item>
          <v-tab-item id="finished">
            <v-card flat v-if="finished">
              <v-card v-for="msg in finished" :key="msg._id">
                <v-container fluid grind-list-lg @click="view(msg)">
                  <v-layout row>
                    <v-flex xs12 md6>
                      <v-card-title primaly-title>
                        <div>
                          <h3 class="subheading mb-1">Dialogo: {{ msg._id }}</h3>
                          <h5 class="body-1">{{ dtFormat(msg.captured) }}</h5>
                          <h6 class="caption">{{ msg.responsible.name }} - {{ msg.responsible.email }}</h6>
                        </div>
                      </v-card-title>
                    </v-flex>
                    <v-flex xs12 md6>
                      <h5 class="caption">Data estipulada da entrega:</h5>
                      <v-chip color="" text-color="">
                        <v-avatar>
                          <v-icon>fa fa-clock-o</v-icon>
                        </v-avatar>
                        {{ dtFormat(msg.due_date) }}
                      </v-chip>
                    </v-flex>
                    <v-flex xs12 md6>
                      <h5 class="caption">Data da entrega:</h5>
                      <v-chip color="" text-color="">
                        <v-avatar>
                          <v-icon>fa fa-clock-o</v-icon>
                        </v-avatar>
                        {{ dtFormat(msg.solved_date) }}
                      </v-chip>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-divider></v-divider>
              </v-card>
            </v-card>
            <v-jumbotron v-if="!isValidFinishedDialogs">
              <v-container fill-height>
                <v-layout align-center>
                  <v-flex>
                    <h3 class="display-3">Nenhum diálogo até o momento</h3>
                    <span class="subheading">Nenhum diálogo foi finalizado até o momento.</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-jumbotron>
          </v-tab-item>
        </v-tabs>
      </v-flex>
      <current-dialog v-on:updatescreen="fetchData({id: active})"></current-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import Dialog from '../dialog/Dialog.vue'
export default {
  created () {
    this.$store.dispatch('GET_UNSEEN_DIALOGS').then(() => {
      console.log(this.unseen)
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    unseen () {
      return this.filteredCollection || this.$store.getters.getUnseenDialogs
    },
    pending () {
      return this.filteredCollection || this.$store.getters.getPendingDialogs
    },
    finished () {
      return this.filteredCollection || this.$store.getters.getFinishedDialogs
    },
    isValidUnseenDialogs () {
      if (this.unseen) {
        if (this.unseen.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isValidPendingDialogs () {
      if (this.pending) {
        if (this.pending.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isValidFinishedDialogs () {
      if (this.finished) {
        if (this.finished.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  components: {
    currentDialog: Dialog
  },
  data () {
    return {
      active: null,
      filteredCollection: null,
      tabs: [
        {id: 'unseen', title: 'Não Visualizadas'},
        {id: 'pending', title: 'Pendentes'},
        {id: 'finished', title: 'Finalizados'}
      ],
      searchQuery: null,
      selectedDialog: null
    }
  },
  methods: {
    view (msg) {
      this.$store.commit('SET_CURRENT_DIALOG', msg)
    },
    deadline (date) {
      let currentDate = this.$moment(Date.now())
      let dl = this.$moment(date)
      let remaining = dl.diff(currentDate, 'days')
      if (remaining > 1) {
        return 'green'
      } else if (remaining <= 0) {
        return 'red'
      } else {
        return 'yellow'
      }
    },
    dtFormat (timestamp) {
      return this.$moment(timestamp).format('DD/MM/YYYY - HH:mm')
    },
    fetchData (tab) {
      console.log(tab.id)
      this.filteredCollection = null
      switch (tab.id) {
        case 'unseen':
          this.$store.dispatch('GET_UNSEEN_DIALOGS').then(() => {
          })
          break
        case 'pending':
          this.$store.dispatch('GET_PENDING_DIALOGS').then(() => {
          }).catch(err => {
            console.log(err)
          })
          break
        case 'finished':
          this.$store.dispatch('GET_FINISHED_DIALOGS')
          break
      }
    },
    search () {
      if (this.active === 'unseen') {
        this.filteredCollection = this.unseen.filter(item => item._id === this.searchQuery)
      } else if (this.active === 'pending') {
        this.filteredCollection = this.pending.filter(item => item._id === this.searchQuery)
      } else if (this.active === 'finished') {
        this.filteredCollection = this.finished.filter(item => item._id === this.searchQuery)
      }
      return this.filteredCollection
    }
  }
}
</script>
<style lang="scss">
  @import './Curatorship.scss'
</style>