<template>
  <div class="facaparte">
    <v-card-media :src="require('@/assets/png/facaparte/integri.png')" height="553px">
      <v-container grid-list-md fill-height fluid>
        <v-layout align-center justify-center>
          <h1>Toda <strong>colaboração</strong> é <strong>bem-vinda</strong></h1>
        </v-layout>
      </v-container>
    </v-card-media>
    <v-container fluid grid-list-xs>
      <v-layout row wrap>
        <v-flex md4 xs12>
          <v-btn class="faca--card" block @click="selectOption('share')">Compartilhe Conteúdo</v-btn>
        </v-flex>
        <v-flex md4 xs12>
          <v-btn class="faca--card" block @click="selectOption('volunteer')">Seja um voluntário</v-btn>
        </v-flex>
        <v-flex md4 xs12>
          <v-btn class="faca--card" block @click="selectOption('referral')">Indique Organizações Sociais</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-lg class="form-faca-parte" v-if="displayForm">
      <form @submit.prevent="validateBeforeSubmit">
        <v-layout row wrap>
          <v-flex lg6 md6 xs12>
            <div class="input-block">
              <label class="input-label" for="Nome">Nome</label>
              <input type="text" name="nome" v-validate="'required|alpha'"
                    :class="{'input-text': true, 'is-danger': errors.has('nome') }"
                    v-model="name">
              <span class="input-error" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
            </div>
          </v-flex>
          <v-flex lg6 md6 xs12>
            <div class="input-block">
              <label class="input-label" for="email">Email</label>
              <input type="email"
                     name="email"
                     :class="{'input-text': true, 'is-danger': errors.has('email') }"
                     v-validate="'required|email'"
                     v-model="email">
              <span class="input-error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
          </v-flex>
          <v-flex lg12 xs12>
            <div class="input-block">
              <label class="input-label" for="howtocolaborate">Como gostaria de Colaborar</label>
              <textarea name="colaborar"
                      :class="{'input-textarea': true, 'is-danger': errors.has('colaborar') }"
                      v-validate="'required|alpha'"
                      v-model="howtocolaborate"></textarea>
              <span class="input-error" v-show="errors.has('colaborar')">{{ errors.first('colaborar') }}</span>
            </div>
            <v-btn right class="btn-enviar" type="submit">Enviar</v-btn>
          </v-flex>
        </v-layout>
      </form>
    </v-container>
  </div>
</template>
<script>

export default {
  components: {
  },
  data: () => ({
    email: '',
    name: '',
    colaborar: '',
    locale: 'pt',
    displayForm: null
  }),
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          // eslint-disable-next-line
          alert('From Submitted!');
          return
        }
      })
    },
    selectOption (value) {
      if (value === 'volunteer') {
        window.open('https://beta.parceirosvoluntarios.atados.com.br/', '_blank')
        this.displayForm = false
      } else {
        this.displayForm = value
      }
    }
  }
}
</script>
<style lang="sass">
  @import './FacaParte.scss'
</style>
