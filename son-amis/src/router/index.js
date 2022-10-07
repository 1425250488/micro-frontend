import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/*',
    name: 'home',
    component: HomeView
  }
]

const router = new VueRouter({
  mode: 'history', // require service support
  base: 'go-amis', //作为子路由设置基础路径
  routes
})

export default router
