// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import('../node_modules/vuetify/dist/vuetify.min.css')
import Vuex from 'vuex'

import store from './store/store'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(Vuex)
/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
}).$mount('#app')
