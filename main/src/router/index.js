import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { isJSON } from "@/utils"

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/menu',
  //   name: 'Example',
  //   meta: { title: '权限管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'admin',
  //       name: 'Admin',
  //       component: () => import('@/views/permission/admin/index'),
  //       meta: { title: '管理员管理', icon: 'el-icon-s-help' }
  //     },
  //     {
  //       path: 'menu',
  //       name: 'Menu',
  //       component: () => import('@/views/permission/menu/index'),
  //       meta: { title: '菜单管理', icon: 'el-icon-s-help' }
  //     },
  //     {
  //       path: 'role',
  //       name: 'Role',
  //       component: () => import('@/views/permission/role/index'),
  //       meta: { title: '角色管理', icon: 'el-icon-s-help' }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

//获取动态路由 (有问题)
const menu = localStorage.getItem('menu')
if( menu && isJSON(menu) ){
  let routerList = [{
    path: '/aaa',
    component: Layout,
    children: JSON.parse(menu).map(item => {
      let path = item.router_url
      let obj = {
        path: item.path,
        name: item.router_name,
        meta: { title: item.menu_name, icon: item.icon },
        component: loadView(path) //() => import(`@/views/${path}`) //() => resolve=>require([`@/views/${item.router_url}`],resolve)
      }
      // try {
      //   obj.component = loadView(item.router_url)  //import(`@/views/${item.router_url}`)//import('@/views/permission/role/index') // () => import( item.router_url ) // _import(item.router_url) // () => import(`@/views` + item.router_url) // import(`@/views` + item.router_url)
      // } catch (e) {
      //   obj.component = () => import('@/views/404')
      // }
      // try {
      //   obj.component = () => resolve=>require([`@/views/${item.router_url}`],resolve)  //import(`@/views/${item.router_url}`)//import('@/views/permission/role/index') // () => import( item.router_url ) // _import(item.router_url) // () => import(`@/views` + item.router_url) // import(`@/views` + item.router_url)
      // } catch (e) {
      //   obj.component = () => import('@/views/404')
      // }
      return obj
    })
  }]
  console.log(routerList)
  router.addRoutes(routerList)
}

function loadView(file){
  // webpack4 中动态import不支持以变量的方式
  // return () => import(`@/views/${file}`)
  return (resolve) => require([`@/views/${file}`], resolve)
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
