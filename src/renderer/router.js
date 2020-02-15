import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import MainPage from './components/MainPage'
import Insert from './components/Insert'
Vue.use(VueRouter)
const routes = [
  {
    path: '/mainPage',
    component: MainPage,
    children: [
      {
        path: '/',
        component: Insert
      },
      {
        path: 'insert',
        component: Insert
      }
    ]
  },
  {
    path: '/',
    redirect: '/mainPage'
  }
]

var router = new VueRouter({
  mode: 'hash',
  routes
})
router.beforeEach((to, from, next) => {
  next()
})
export default router
