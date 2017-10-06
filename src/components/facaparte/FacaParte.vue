<template>
  <div class="facaparte">
    <v-card-media :src="require('@/assets/png/facaparte/integri.png')" height="553px">
      <v-container fill-height fluid>
        <v-layout align-center justify-center>
          <h1>Toda <strong>colaboração</strong> é <strong>bem-vinda</strong></h1>
        </v-layout>
      </v-container>
    </v-card-media>
    <v-layout row wrap>
      <v-flex xs12 lg4 class="facacallout mr-1">
        <h6>Compartilhe Conteúdo</h6>
      </v-flex>
      <v-flex xs12 lg4 class="facacallout mr-1">
        <h6>Aporte Conhecimento Técnico</h6>
      </v-flex>
      <v-flex xs12 lg4 class="facacallout lastone">
        <h6>Indique Organizações Sociais</h6>
      </v-flex>
    </v-layout>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <div class="input-block">
            <label for="Nome">Nome</label>
            <input type="text" class="name-input">
          </div>
          <div class="input-block">
            <label for="email">Email</label>
            <input type="email" class="email-input">
          </div>
          <div class="textarea-input-block">
            <label for="whyto">Como gostaria de Colaborar</label>
            <textarea row="" cols=""></textarea>
          </div>
          <v-btn light>Enviar</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>
<script>
export default {
  components: {
  }
}
</script>
<style lang="sass">
  @import './FacaParte.scss'
</style>
