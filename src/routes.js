import Home from './components/home/Home.vue'
import FacaParte from './components/facaparte/FacaParte.vue'
import Conteudo from './components/conteudo/Conteudo.vue'
import Login from './components/login/Login.vue'
import ShareSocial from './components/share/ShareSocial.vue'
import Sponsors from './components/sponsors/Sponsors.vue'
import PrivacyPolicy from './components/privacy-policy/PrivacyPolicy.vue'
import UsageTerms from './components/usage-terms/UsageTerms.vue'
import Curatorship from './components/curatorship/Curatorship.vue'
import store from './store/store'

export const routes = [
  {path: '', alias: '/home', components: {default: Home, share: ShareSocial, sponsors: Sponsors}},
  {path: '/facaparte', components: {default: FacaParte, share: ShareSocial, sponsors: Sponsors}},
  {
    path: '/conteudo',
    component: Conteudo,
    beforeEnter: (to, from, next) => {
      store.dispatch('LOAD_CONTENT_VIDEOS').then(res => {
        next()
      }).catch(err => {
        console.log(err)
        console.log(from)
      })
    }
  },
  {path: '/login', component: Login},
  {path: '/politicas/privacidade', component: PrivacyPolicy},
  {path: '/politicas/uso', component: UsageTerms},
  {path: '/_=_', redirect: '/home'},
  {
    path: '/curadoria',
    component: Curatorship,
    beforeEnter: (to, from, next) => {
      // store.dispatch('LOGIN').then(() => {
      //   console.log(store.getters.getUser)
      // })
      console.log('Teste de before Enter')
      next()
    }
  }
]
