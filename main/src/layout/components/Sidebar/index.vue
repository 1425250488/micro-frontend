<template>
  <div :class="{'has-logo':showLogo}">
<!--    {{ routers }}-->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import {listToTree} from "@/utils"

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapState({
      menu: state => state.user.menu
    }),
    ...mapGetters([
      'sidebar',
    ]),
    routes(){
      let tree = listToTree(this.menu.map(item => {
        return {
          name: item.router_name,
          path: item.path,
          meta:{
            title: item.menu_name,
            icon: item.icon
          },
          menu_id: item.menu_id,
          pid: item.pid
        }
      }), { keyValue: 'menu_id', keyPid: 'pid' })
      console.log( "菜单树 ----- >>>>>", tree )
      return tree
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    // let sz = [
    //   {
    //     menu_id: '1',
    //     pid: '22',
    //     path: '/staff',
    //     icon: 'table',
    //     menu_name: '推广员列表',
    //     router_url: '/staff/index',
    //     router_auth: '',
    //     router_cache: '',
    //     router_name: 'Staff',
    //     sort: 1,
    //     is_show: true
    //   }
    // ]
    // let routerList = [{
    //   path: '/',
    //   component: Layout,
    //   children: sz.map(item => {
    //     let obj = {
    //       path: item.path,
    //       name: item.router_name,
    //       meta: { title: item.menu_name, icon: item.icon }
    //     }
    //     try {
    //       item.component = () => import(`@/views` + item.router_url)
    //     } catch (e) {
    //       item.component = () => import('@/views/404')
    //     }
    //     return obj
    //   })
    // }]
    // router.addRoutes(routerList)
  }
}
</script>
