<template>
  <div>
    <v-card-media :src="require('@/assets/png/home/integri_background.png')" height="553px">
      <v-container fill-height fluid>
        <v-layout align-center justify-center>
          <v-flex xs3>
            <img :src="require('@/assets/svg/home/Integri_titulo.svg')" alt="">
            <login-twitter></login-twitter>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-media>
  </div>
</template>

<script>
import LoginTwitter from '../login-twitter/LoginTwitter'
export default{
  components: {
    LoginTwitter
  }
}
</script>
