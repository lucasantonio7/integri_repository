<template>
    <v-layout row wrap class="overflow-hidden">
      <v-flex x12 md5 class="social-medias-block">
        <h6 class="caption">Conheça as redes sociais do Integri!</h6>
        <v-layout row wrap class="social-btns">
          <a href="https://www.facebook.com/integri.org/" target="_blank" class="social-link">
            <v-btn icon>
              <v-icon>fa fa-facebook</v-icon>
            </v-btn>
          </a>
          <a href="https://twitter.com/Integri_org" target="_blank" class="social-link">
            <v-btn icon>
              <v-icon>fa fa-twitter</v-icon>
            </v-btn>
          </a>
          <a href="https://www.instagram.com/integri_org/" target="_blank" class="social-link">
            <v-btn icon>
              <v-icon>fa fa-instagram</v-icon>
            </v-btn>
          </a>
        </v-layout>
      </v-flex>
      <v-flex md2 hidden-sm-and-down class="slash"></v-flex>
      <v-flex x12 md5 class="social-newsletter-block">
        <h6 class="body-1">Fique por dentro das novidades!</h6>
        <v-form class="input-block">
          <v-text-field solo type="email" label="E-mail" v-model="email" :rules="emailRules"></v-text-field>
          <v-btn light :block="$vuetify.breakpoint.smAndDown">Enviar</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
</template>
<script>
export default {
  data () {
    return {
      email: '',
      emailRules: [
        v => !!v || 'E-mail deve ser preenchido',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ]
    }
  }
}
</script>

<style lang="sass">
  @import 'ShareSocial'
</style>

