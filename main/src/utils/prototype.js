import { Loading } from 'element-ui'
import api from '@/api/api'

export default {
  install(Vue) {
    // 加载中全局配置
    Vue.prototype.$elLoading = function ({ lock = true, text = '加载中', spinner = 'el-icon-loading', background = 'rgba(0,0,0,0)', body = false}) {
      return Loading.service(
        {
          lock: true,
          body: body,
          text: text || '保存中',
          spinner: 'el-icon-loading',
          customClass: 'my-el-loading',
          background: 'rgba(0,0,0,0)'
        }
      )
    }
    // 全局api
    Vue.prototype.$api = api
    // 全局page
    Vue.prototype.$page = {
      Sizes: [10, 15, 20, 30, 40, 50, 100, 500],
      size: 10,
      page: 1,
      total: 0
    }
  }
}
