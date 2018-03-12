import Home from './components/home/Home.vue'
import FacaParte from './components/facaparte/FacaParte.vue'
import Conteudo from './components/conteudo/Conteudo.vue'
import Login from './components/login/Login.vue'
import ShareSocial from './components/share/ShareSocial.vue'
import Sponsors from './components/sponsors/Sponsors.vue'
import PrivacyPolicy from './components/privacy-policy/PrivacyPolicy.vue'
import UsageTerms from './components/usage-terms/UsageTerms.vue'
import Curatorship from './components/curatorship/Curatorship.vue'
import TextContent from './components/text-content/TextContent.vue'
// import store from './store/store'

export const routes = [
  {path: '', alias: '/home', components: {default: Home, share: ShareSocial, sponsors: Sponsors}},
  {path: '/facaparte', components: {default: FacaParte, share: ShareSocial, sponsors: Sponsors}},
  {
    path: '/conteudo',
    beforeEnter: (to, from, next) => {
      next()
    },
    component: Conteudo
  },
  {path: '/login', component: Login},
  {path: '/politicas/privacidade', component: PrivacyPolicy},
  {path: '/politicas/uso', component: UsageTerms},
  {path: '/texto/:id', component: TextContent},
  {path: '/_=_', redirect: '/home'},
  {
    path: '/curadoria',
    component: Curatorship,
    beforeEnter: (to, from, next) => {
      next()
    }
  }
]
