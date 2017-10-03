// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import('../node_modules/vuetify/dist/vuetify.min.css')
import Vuex from 'vuex'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueRouter from 'vue-router'
import { routes } from './routes'
import store from './store/store'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueYouTubeEmbed)
Vue.use(VueRouter)
/* eslint-disable no-new */

const router = new VueRouter({
  routes
})

new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
