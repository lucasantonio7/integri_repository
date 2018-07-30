<template>
  <div class="sponsors">
  <v-container class="partners-wrapper">
    <v-layout row wrap>
      <v-flex xs12 class="sponsor">
        <h6 class="sponsor-title">Realização</h6>
        <v-layout row wrap>
          <v-flex xs4 offset-xs4>
            <img :src="require('@/assets/svg/partners/realizacao_pv.svg')" alt="">
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 lg6 class="technical-partner">
        <h6 class="partners-title">PARCEIROS TÉCNICOS</h6>
        <v-layout row wrap>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/tech_partners_4all.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/tech_partners_cappra.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/tech_partners_ciandt.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/tech_partners_ibm.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/tech_partners_inst_aprender.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/tech_partners_inst_microsoft.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/tech_partners_inst_unisinos.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/tech_partners_atados.svg')" alt="">
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 lg6 class="financial-partner">
        <h6 class="partners-title">PARCEIROS FINANCEIROS</h6>
        <v-layout row wrap>
          <v-flex xs3>
          <img :src="require('@/assets/svg/partners/fin_partners_gerdau.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/fin_partners_processor.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/fin_partners_puras.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/fin_partners_paulo_afonso.svg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/svg/partners/fin_partners_paulo_stihl.svg')" alt="">
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>

<style lang="sass">
  @import 'Sponsors'
</style>

