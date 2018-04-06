<template>
  <div class="facaparte">
    <v-card-media :src="require('@/assets/jpg/facaparte-min.jpeg')" height="553px" class="facaparte-mask">
      <v-container grid-list-md fill-height fluid>
        <v-layout align-center justify-center>
          <h1>Toda <strong>colaboração</strong> é <strong>bem-vinda</strong></h1>
        </v-layout>
      </v-container>
    </v-card-media>
    <v-container fluid grid-list-xs>
      <v-layout row wrap>
        <v-flex md4 xs12>
          <v-btn class="faca--card" :class="{ 'elevation-10 active': selected === options.share.id }" block @click="selectOption(options.share.id)">{{ options.share.text }}</v-btn>
        </v-flex>
        <v-flex md4 xs12>
          <v-btn class="faca--card" block :href="options.volunteering.href" target="_blank">{{ options.volunteering.text }}</v-btn>
        </v-flex>
        <v-flex md4 xs12>
          <v-btn class="faca--card" block :href="options.ngo.href" target="_blank">{{ options.ngo.text }}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-lg class="form-faca-parte" v-if="displayForm">
      <form @submit.prevent="validateBeforeSubmit">
        <v-layout row wrap>
          <v-flex lg6 md6 xs12>
            <div class="input-block">
              <label class="input-label" for="nome">Nome</label>
              <input type="text" name="nome" v-validate="'required|alpha_spaces'"
                    :class="{ 'input-text': true, 'is-danger': errors.has('nome') }"
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
              <label class="input-label" for="colaborar">Como gostaria de Colaborar</label>
              <textarea name="colaborar"
                      :class="{'input-textarea': true, 'is-danger': errors.has('colaborar') }"
                      v-validate="'required'"
                      v-model="colaborar"
                      placeholder="Cole um link ou texto que deseja compartilhar"></textarea>
              <span class="input-error" v-show="errors.has('colaborar')">{{ errors.first('colaborar') }}</span>
            </div>
            <h4>{{ error }}</h4>
            <v-btn right class="btn-enviar" type="submit">Enviar</v-btn>
          </v-flex>
        </v-layout>
      </form>
    </v-container>
    <div class="waiting" v-if="sendingData">
      <h3>Aguarde, estamos enviando os dados</h3>
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
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
    displayForm: null,
    error: null,
    sendingData: false,
    options: {
      share: {
        id: 'share',
        text: 'Compartilhe Conteúdo'
      },
      volunteering: {
        id: 'volunteering',
        text: 'Seja um voluntário',
        href: 'https://parceirosvoluntarios.atados.com.br/'
      },
      ngo: {
        id: 'ngo',
        text: 'Inscreva sua ONG',
        href: 'https://parceirosvoluntarios.atados.com.br/'
      }
    },
    selected: ''
  }),
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.sendingData = true
          this.$store.dispatch('CONTENT_SHARE', {email: this.email, name: this.name, data: this.colaborar}).then(res => {
            this.sendingData = false
            this.error = false
            // Clear all fields
            this.email = ''
            this.name = ''
            this.colaborar = ''
            this.$validator.reset()
          }).catch(err => {
            if (err.response.status === 403) {
              this.error = 'Novo conteúdo enviado em menos de '
            }
            this.sendingData = false
          })
        }
      })
    },
    selectOption (value) {
      this.selected = value
      if (value === this.options.share.id) {
        this.displayForm = value
      }
    }
  }
}
</script>
<style lang="sass">
  @import './FacaParte.scss'
</style>
