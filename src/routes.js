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
import Dashboard from './components/dashboard/Dashboard'
import DashboardContentManagement from './components/dashboard-manage-content/DashboardManageContent'
import DashboardFeature from './components/dashboard-feature/DashboardFeature'
import DashboardNewsletter from './components/dashboard-newsletter/DashboardNewsletter'
import DashboardUsersManagement from './components/dashboard-manage-users/DashboardManageUsers'
import DashboardSharedContent from './components/dashboard-shared-content/DashboardSharedContent'
import store from './store/store'

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
  {
    path: '/login',
    component: Login,
    beforeRouteLeave (to, from, next) {
      if (store.getters.getLoginReturn) {
        store.commit('CLEAR_LOGIN_RETURN')
      }
    }
  },
  {path: '/politicas/privacidade', component: PrivacyPolicy},
  {path: '/politicas/uso', component: UsageTerms},
  {path: '/texto/:id', component: TextContent},
  {path: '/_=_', redirect: '/home'},
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      store.dispatch('LOGIN').then(res => {
        if (store.getters.getUser.login && (store.getters.getUser.user_data.role === 'admin' || store.getters.getUser.user_data.role === 'curator')) {
          store.dispatch('LOAD_FEATURES')
          next()
        } else {
          store.commit('SET_LOGIN_RETURN', '/dashboard')
          next('/login')
        }
      }).catch(err => {
        console.log(err)
        store.commit('SET_LOGIN_RETURN', '/dashboard')
        next('/login')
      })
    },
    children: [
      {
        path: '',
        component: DashboardFeature
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: DashboardUsersManagement
      },
      {
        path: 'conteudo',
        name: 'conteudo',
        component: DashboardContentManagement,
        children: [
          {
            path: 'novo'
          }
        ]
      },
      {
        path: 'curadoria',
        name: 'curadoria',
        component: Curatorship
      },
      {
        path: 'newsletter',
        name: 'newsletter',
        component: DashboardNewsletter
      },
      {
        path: 'compartilhado',
        name: 'compartilhado',
        component: DashboardSharedContent
      }
    ]
  }
]
