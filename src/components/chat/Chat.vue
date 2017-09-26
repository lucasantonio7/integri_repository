<template>
  <div>
    <div class="chat-btn">
      <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="">
      <span class="text-piece">Conte-nos sobre você!</span>
    </div>
    <div class="chat-wrapper">
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar dark class="chat-customized-toolbar">
              <img :src="require('@/assets/svg/home/logo_chatbot.svg')" alt="">
              <v-toolbar-title>
                <img :src="require('@/assets/svg/home/Integri.svg')" alt="">
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="hidden-xs-only">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 align-end>
            <!-- Here goes the chat -->
          </v-flex>
          <fcb></fcb>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="sass">
  @import 'Chat'
</style>
