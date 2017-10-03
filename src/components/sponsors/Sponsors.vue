<template>
  <div class="sponsors">
  <v-container class="partners-wrapper">
    <v-layout row wrap>
      <v-flex xs12 lg6 class="technical-partner">
        <h6 class="partners-title">PARCEIROS TÉCNICOS</h6>
        <v-layout row wrap>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/tecnicos/tec_partners_4all.jpg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/tecnicos/tec_partners_cappra.jpg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/tecnicos/tec_partners_ciet.jpg')" alt="">
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/tecnicos/tec_partners_ibm.jpg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/tecnicos/tec_partners_inst_aprender.jpg')" alt="">
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 lg6 class="financial-partner">
        <h6 class="partners-title">PARCEIROS FINANCEIROS</h6>
        <v-layout row wrap>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/financeiros/fin_partners_gerdau.jpg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/financeiros/fin_partners_processor.jpg')" alt="">
          </v-flex>
          <v-flex xs2>
            <img :src="require('@/assets/jpg/partners/financeiros/fin_partners_puras.jpg')" alt="">
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/financeiros/fin_partners_pauloafonso.jpg')" alt="">
          </v-flex>
          <v-flex xs3>
            <img :src="require('@/assets/jpg/partners/financeiros/fin_partners_stihl.jpg')" alt="">
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

