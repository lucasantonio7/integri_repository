<template>
    <v-layout row wrap class="overflow-hidden">
      <v-flex x12 md5 class="social-medias-block">
        <h6 class="caption">Conheça as redes sociais do Integri!</h6>
        <v-layout row wrap class="social-btns">
          <a href="https://www.facebook.com/integri.org/" target="_blank" class="social-link">
            <v-btn icon>
              <v-icon>fab fa-facebook-f</v-icon>
            </v-btn>
          </a>
          <a href="https://twitter.com/Integri_org" target="_blank" class="social-link">
            <v-btn icon>
              <v-icon>fab fa-twitter</v-icon>
            </v-btn>
          </a>
          <a href="https://www.instagram.com/integri_org/" target="_blank" class="social-link">
            <v-btn icon>
              <v-icon>fab fa-instagram</v-icon>
            </v-btn>
          </a>
        </v-layout>
      </v-flex>
      <v-flex md2 hidden-sm-and-down :class="['slash', {'bigger': displayFeedbackMessage === 'error'}]"></v-flex>
      <v-flex x12 md5 class="social-newsletter-block">
        <h6 class="body-1">Fique por dentro das novidades!</h6>
        <v-form class="input-block" @submit.prevent="validateBeforeSubmit">
          <v-text-field solo type="email" name="email"
                     :class="{'is-danger': errors.has('email') }"
                     v-validate="'required|email'" 
                     label="Insira aqui seu e-mail"
                     v-model="email"></v-text-field>
          <p ma-0 class="animated bounceIn white--text" :class="{'input-error': displayFeedbackMessage === 'error'}" v-show="!!displayFeedbackMessage">
            {{ errors.first('email') || feedback }}
            <v-progress-circular indeterminate v-if="displayFeedbackMessage === 'processing'"></v-progress-circular>
          </p>
          <v-btn light @click.prevent="validateBeforeSubmit" :block="$vuetify.breakpoint.smAndDown" mx-0 :disabled="errors.has('email') || email.length < 1">Enviar</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
</template>
<script>
export default {
  data () {
    return {
      email: '',
      feedback: '',
      error: false,
      processing: null
    }
  },
  computed: {
    displayFeedbackMessage () {
      if (this.$validator.errors.has('email') || this.error) {
        return 'error'
      } else if (this.processing) {
        return 'processing'
      } else if (this.feedback) {
        return 'feedback'
      } else {
        return false
      }
    }
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.subscribe()
        }
      })
    },
    subscribe () {
      this.feedback = 'Aguardem, estamos processando sua inscrição'
      this.error = false
      this.processing = true
      this.$store.dispatch('SUBSCRIBE_NEWSLETTER', this.email).then(res => {
        this.error = null
        this.feedback = 'E-mail inscrito com sucesso em nossa newsletter!'
        this.email = ''
        this.clear()
        this.processing = false
      }).catch(err => {
        if (err.response.status === 403) {
          this.feedback = 'Este e-mail já está cadastrado em nossa newsletter'
          this.error = true
          this.processing = false
        }
      })
    },
    clear () {
      this.$validator.reset()
      let instance = this
      setTimeout(() => {
        instance.feedback = ''
      }, 4500)
    }
  }
}
</script>

<style lang="sass">
  @import 'ShareSocial'
</style>

