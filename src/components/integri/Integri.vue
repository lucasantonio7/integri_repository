<template>
  <div class="integri">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <h3 class="display-2 white--text py-4">Bem vindo!</h3>
          <blockquote class="headline white--text pr-5 pl-5 py-3">O Integri conecta indivíduos a práticas do bem através de uma vasta rede de conteúdo e oportunidade</blockquote>
        </v-flex>
        <v-flex xs12 md4 py-5>
          <img class="pa-3 pr-5 pl-5 pb-3 full-img" :src="require('@/assets/svg/home/faixa_tempo.svg')" alt="">
          <h5 class="white--text pr-5 pl-5 py-3 title">No seu tempo</h5>
        </v-flex>
        <v-flex xs12 md4 py-5>
          <img class="pa-3 pr-5 pl-5 full-img" :src="require('@/assets/svg/home/faixa_proposito.svg')" alt="">
          <h5 class="white--text pr-5 pl-5 py-3 title">De acordo com o seu propósito</h5>
        </v-flex>
        <v-flex xs12 md4 py-5>
          <img class="pa-3 pr-5 pl-5 full-img" :src="require('@/assets/svg/home/faixa_forma.svg')" alt="">
          <h5 class="white--text pr-5 pl-5 py-3 title">Da melhor forma para você</h5>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
</script>
<style lang="sass">
  @import './integri.scss'
</style>

