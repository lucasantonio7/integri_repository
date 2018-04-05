<template>
  <v-layout row v-if="dialog">
    <v-dialog v-model="dialog" fullscreen scrollable max-width="100vh" transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar>
          <v-btn flat @click="back">
            <v-icon>fa fa-chevron-left</v-icon>
            Voltar
          </v-btn>
          <v-toolbar-title>Diálogo: {{ dialog._id }} - {{ dtFormat(dialog.captured) }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <!-- Dialog goes here -->
          <v-container column>
            <v-layout column v-for="(msg, index) in dialog.messages" :key="index">
            <div class="dialog-line-watson" v-if="msg.sender === 'watson'">
              <div class="watson-msg">{{ msg.message }}</div>
            </div>
            <div class="dialog-line-user" v-if="msg.sender === 'user'">
              <div class="user-msg" :class="{'wrong-feedback': msg.feedback === false && msg.isFeedback}">{{ msg.message }}</div>
              <!-- Verificar se o feedback é elegivel (e marcar o escopo?) -->
              <!-- <div class="interaction">
                <v-icon @click="copy(msg.message)">fa fa-clipboard</v-icon>
              </div> -->
            </div>
          </v-layout>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex x12>
                <v-checkbox label="Descartar curadoria" v-model="discardCuratorship"></v-checkbox>
              </v-flex>
              <v-flex xs6 md3>
                <v-text-field label="Nome do curador" :rules="nameRules" v-model="dialog.responsible.name" :required="!discardCuratorship" :disabled="dialog.status !== null"></v-text-field>
              </v-flex>
              <v-flex xs6 md3>
                <v-text-field label="E-mail do curador" :rules="emailRules" v-model="dialog.responsible.email" :required="!discardCuratorship" :disabled="dialog.status !== null"></v-text-field>
              </v-flex>
              <v-flex xs11 sm4 md2>
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Entregar dia"
                    v-model="formatedDueDate"
                    prepend-icon="event"
                    readonly
                    :disabled="dialog.solved_date !== null"
                  ></v-text-field>
                  <v-date-picker v-model="temporaryData.due_date" no-title scrollable actions locale="pt-br">
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancelar</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs11 sm4 md2 v-if="dialog.solved_date">
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    label="Finalizado dia"
                    v-model="formatedSolvedDate"
                    prepend-icon="event"
                    readonly
                    :disabled="dialog.solved_date !== null"
                  ></v-text-field>
                  <v-date-picker v-model="temporaryData.due_date" no-title scrollable actions locale="pt-br">
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel">Cancelar</v-btn>
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm4 md2>
                <v-btn block v-if="showSaveButton" :disabled="!dialog.responsible.name || !dialog.responsible.email || !temporaryData.due_date" @click="submit">Salvar</v-btn>
                <v-btn block v-if="showFinishButton" @click="finish">Finalizar</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import axios from 'axios'
export default {
  computed: {
    dialog () {
      return this.$store.getters.getCurrentDialog
    },
    formatedDueDate () {
      if (this.dialog.due_date && !this.temporaryData.due_date) {
        return this.$moment(this.dialog.due_date).format('YYYY-MM-DD')
      } else {
        console.log(this.temporaryData.due_date)
        return this.temporaryData.due_date
      }
    },
    formatedSolvedDate () {
      return this.$moment(this.dialog.solved_date).format('YYYY-MM-DD')
    },
    showSaveButton () {
      if (!this.discardCuratorship) {
        if (!this.dialog.status && !this.dialog.due_date) {
          return true
        } else if (this.temporaryData.due_date) {
          return true
        }
      } else {
        return false
      }
    },
    showFinishButton () {
      if (this.discardCuratorship) {
        return true
      } else {
        return (!this.temporaryData.due_date && this.dialog.status !== null && this.dialog.due_date !== null && !this.dialog.solved_date)
      }
    }
  },
  data () {
    return {
      menu: false,
      temporaryData: {
        due_date: null,
        name: null,
        email: null
      },
      discardCuratorship: false,
      emailRules: [
        v => !!v || 'E-mail deve ser preenchido',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail deve ser válido'
      ],
      nameRules: [
        v => !!v || 'O nome deve ser preenchido'
      ]
    }
  },
  methods: {
    back () {
      this.$store.commit('SET_CURRENT_DIALOG', null)
    },
    dtFormat (timestamp) {
      return this.$moment(timestamp).format('DD/MM/YYYY - HH:mm')
    },
    submit () {
      console.log(this.temporaryData.due_date)
      if (this.temporaryData.due_date) {
        this.dialog.due_date = this.$moment(this.temporaryData.due_date, 'YYYY-MM-DD')
        this.dialog.due_date = this.dialog.due_date.valueOf()
      }
      axios.post('/api/curatorship/update', {dialog: this.dialog}).then(res => {
        this.temporaryData.due_date = null
        this.$emit('updatescreen')
        this.$store.commit('SET_CURRENT_DIALOG', null)
      }).catch(err => {
        console.log(err)
      })
    },
    finish () {
      this.dialog.solved_date = this.$moment(Date.now())
      this.dialog.solved_date = this.dialog.solved_date.valueOf()
      this.dialog.due_date = this.dialog.solved_date.valueOf()
      try {
        this.dialog.responsible = {
          name: this.$store.getters.getUser.user_data.name,
          email: this.$store.getters.getUser.user_data.medias.integri.email
        }
      } catch (ex) {
        console.log(ex)
      }
      console.log(this.dialog)
      axios.post('/api/curatorship/update', {dialog: this.dialog}).then(res => {
        this.$emit('updatescreen')
        this.$store.commit('SET_CURRENT_DIALOG', null)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss">
  @import './Dialog.scss'
</style>
