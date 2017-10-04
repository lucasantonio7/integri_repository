import Home from './components/home/Home.vue'
import FacaParte from './components/facaparte/FacaParte.vue'
import Plataforma from './components/plataforma/Plataforma.vue'
import Conteudo from './components/conteudo/Conteudo.vue'

export const routes = [
  {path: '', component: Home},
  {path: '/facaparte', component: FacaParte},
  {path: '/plataforma', component: Plataforma},
  {path: '/conteudo', component: Conteudo},
  {path: '/home', component: Home}
]
