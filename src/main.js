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
import VeeValidate from 'vee-validate'
import { routes } from './routes'
import store from './store/store'
import VueCarousel from 'vue-carousel'
import VueClipboard from 'vue-clipboard'
import VueAnalytics from 'vue-analytics'
import wysiwyg from 'vue-wysiwyg'
import VueI18n from 'vue-i18n'
Vue.use(wysiwyg, {
  // Config
})
Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueYouTubeEmbed)
Vue.use(VueRouter)
Vue.use(VueCarousel)
Vue.use(VueClipboard)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'pt_BR'
})

Vue.use(VeeValidate, {
  i18n,
  dictionary: {
    pt_BR
  }
})

const moment = require('moment')
require('moment/locale/pt-br')
Vue.use(require('vue-moment'), {
  moment
})
// Vue.use(vuefb)
/* eslint-disable no-new */
const router = new VueRouter({
  routes
})
Vue.use(VueAnalytics, {
  id: 'UA-113593349-1',
  router
})
new Vue({
  i18n,
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
