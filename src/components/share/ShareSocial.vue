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
        <div class="input-block">
          <input type="email" placeholder="E-mail" class="email-input">
          <v-btn light>Enviar</v-btn>
        </div>
      </v-flex>
    </v-layout>
</template>
<style lang="sass">
  @import 'ShareSocial'
</style>

