// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import('../node_modules/vuetify/dist/vuetify.min.css')
import Vuex from 'vuex'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueRouter from 'vue-router'
/* eslint-disable camelcase */
// created by plugin
import pt_BR from 'vee-validate/dist/locale/pt_BR'
import VeeValidate, { Validator } from 'vee-validate'
import { routes } from './routes'
import store from './store/store'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueYouTubeEmbed)
Vue.use(VueRouter)
Vue.use(VeeValidate, {locale: 'pt_BR'})
Validator.addLocale(pt_BR)
VeeValidate.Validator.setLocale('pt_BR')
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
