<template>
    <v-layout row wrap class="overflow-hidden">
      <v-flex x12 md7 class="social-medias-block">
        <h6>Compartilhe a plataforma Integri!</h6>
        <v-layout row wrap class="social-btns">
          <v-btn icon>
            <v-icon>fa fa-facebook</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>fa fa-twitter</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>fa fa-linkedin</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>fa fa-google-plus</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>fa fa-pinterest-p</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex x12 md5 class="social-newsletter-block">
        <h6>Fique por dentro das novidades!</h6>
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

