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
        <v-card-text >
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
          <v-layout row wrap>
            <v-flex xs6 md3>
              <v-text-field label="Nome do curador" :rules="nameRules" v-model="temporaryData.name" required></v-text-field>
            </v-flex>
            <v-flex xs6 md3>
              <v-text-field label="E-mail do curador" :rules="emailRules" v-model="temporaryData.email" required></v-text-field>
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
                  v-model="temporaryData.due_date"
                  prepend-icon="event"
                  readonly
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
              <v-btn block v-if="!dialog.status && !dialog.due_date" :disabled="!temporaryData.name || !temporaryData.email || !temporaryData.due_date" @click="submit">Salvar</v-btn>
              <v-btn block v-if="dialog.status !== null && dialog.due_date !== null" @click="finish">Finalizar</v-btn>
            </v-flex>
          </v-layout>
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
      return this.$moment(timestamp).utc().format('DD/MM/YYYY - HH:mm')
    },
    submit () {
      console.log(this.temporaryData.due_date)
      console.log(this.temporaryData.name)
      console.log(this.temporaryData.email)
      if (this.temporaryData.due_date && this.temporaryData.name && this.temporaryData.email) {
        this.dialog.due_date = this.$moment(this.temporaryData.due_date, 'YYYY-MM-DD').utc()
        this.dialog.due_date = this.dialog.due_date.valueOf()
        this.dialog.responsible.name = this.temporaryData.name
        this.dialog.responsible.email = this.temporaryData.email
      }
      console.log(this.dialog)
      axios.post('/api/curatorship/update', {dialog: this.dialog}).then(res => {
        this.dialog = null
      }).catch(err => {
        console.log(err)
      })
    },
    finish () {

    }
  }
}
</script>
<style lang="scss">
  @import './Dialog.scss'
</style>
