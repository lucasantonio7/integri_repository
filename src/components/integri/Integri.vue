<template>
  <div class="integri">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <h4 class="white--text">Bem vindo!</h4>
          <p class="title white--text pr-5 pl-5">O Integri conecta indivíduos a práticas do bem através de uma vasta rede de conteúdo e oportunidade</p>
        </v-flex>
        <v-flex xs12 md4>
          <img class="pa-3 pr-5 pl-5 full-img" :src="require('@/assets/svg/home/faixa_tempo.svg')" alt="">
          <h6 class="white--text pr-5 pl-5">No seu tempo</h6>
        </v-flex>
        <v-flex xs12 md4>
          <img class="pa-3 pr-5 pl-5 full-img" :src="require('@/assets/svg/home/faixa_proposito.svg')" alt="">
          <h6 class="white--text pr-5 pl-5">De acordo com o seu propósito</h6>
        </v-flex>
        <v-flex xs12 md4>
          <img class="pa-3 pr-5 pl-5 full-img" :src="require('@/assets/svg/home/faixa_forma.svg')" alt="">
          <h6 class="white--text pr-5 pl-5">Da melhor forma para você</h6>
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

