import Home from './components/home/Home.vue'
import FacaParte from './components/facaparte/FacaParte.vue'
import Plataforma from './components/plataforma/Plataforma.vue'
import Conteudo from './components/conteudo/Conteudo.vue'
import Login from './components/login/Login.vue'
import ShareSocial from './components/share/ShareSocial.vue'
import Sponsors from './components/sponsors/Sponsors.vue'

export const routes = [
  {path: '', components: {default: Home, share: ShareSocial, sponsors: Sponsors}},
  {path: '/facaparte', components: {default: FacaParte, share: ShareSocial, sponsors: Sponsors}},
  {path: '/plataforma', component: Plataforma},
  {path: '/conteudo', component: Conteudo},
  {path: '/home', components: {default: Home, share: ShareSocial, sponsors: Sponsors}},
  {path: '/login', component: Login}
]
