import Home from './components/home/Home.vue'
import FacaParte from './components/facaparte/FacaParte.vue'

export const routes = [
  {path: '', component: Home},
  {path: '/facaparte', component: FacaParte},
  {path: '/home', component: Home}
]
