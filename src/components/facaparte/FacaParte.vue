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
        <v-flex xs4>
           <v-card dark>
             <v-card-text class="px-0 text-xs-center faca--card">Compartilhe <br />Conteúdo</v-card-text>
           </v-card>
        </v-flex>
        <v-flex xs4>
          <v-card dark>
             <v-card-text class="px-0 text-xs-center faca--card">Aporte Conhecimento<br /> Técnico</v-card-text>
           </v-card>
        </v-flex>
        <v-flex xs4>
          <v-card dark>
             <v-card-text class="px-0 text-xs-center faca--card">Indique Organizações<br /> Sociais</v-card-text>
           </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-lg class="form-faca-parte">
      <form @submit.prevent="validateForm">
        <v-layout row wrap>
          <v-flex lg6 md6 xs12>
            <div class="input-block">
              <label class="input-label" for="Nome">Nome</label>
              <input type="text" class="input-text" v-model="name">
              <span class="input-error"></span>
            </div>
          </v-flex>
          <v-flex lg6 md6 xs12>
            <div class="input-block">
              <label class="input-label" for="email">Email</label>
              <input type="email"
                     name="email"
                     class="input-text"
                     v-validate="'required|email'"
                     v-model="email">
              <span class="input-error" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
          </v-flex>
          <v-flex lg12 xs12>
            <div class="input-block">
              <label class="input-label" for="howtocolaborate">Como gostaria de Colaborar</label>
              <textarea row="" cols="" name="howtocolaborate" v-model="howtocolaborate" class="input-textarea"></textarea>
              <span class="input-error"></span>
            </div>
            <v-btn right class="btn-enviar">Enviar</v-btn>
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
    howtocolaborate: '',
    locale: 'pt'
  })
}
</script>
<style lang="sass">
  @import './FacaParte.scss'
</style>
