import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import api from '@/api/api'

const getDefaultState = () => {
  return {
    token: getToken(),
    info: {

    },
    menu: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
    localStorage.setItem('menu', JSON.stringify(menu.filter(item => item.router_url)))
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      api.post('/login', { account: username, password: password }).then(res => {
        commit('SET_TOKEN', res.data.token)
        commit('SET_INFO', res.data.admin)
        commit('SET_MENU', res.data.menu)
        setToken(res.data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.get('/info', {}).then(res => {
        commit('SET_INFO', res.data.admin)
        commit('SET_MENU', res.data.menu)
        // let routerList = [{
        //   path: '/',
        //   component: Layout,
        //   children: data.menu.filter(item => item.router_url).map(item => {
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
        // console.log(routerList)
        // router.addRoutes(routerList)
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

