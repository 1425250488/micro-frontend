import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import 'xe-utils'
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'

VXETable.setup({
  size: 'mini',
  table: {
    id: true,
    border: true,  //显示边框
    resizable: true, //列宽调整
    align: 'center', //列默认对齐方式
    showOverflow: true, //格超出省略号
    showFooterOverflow: true, //表尾超出省略号
    showHeaderOverflow: true, //表头超出省略号
    highlightHoverRow: true, //鼠标移到行高亮显示
    autoResize: true, //自动监听父元素的变化去重新计算表格
    customConfig: { storage: { visible: true, resizable: true } } //列显示隐藏持久化 宽度拖动持久化
  },
  modal: {
    // maskClosable: true
    // size: null,
    // minWidth: 340,
    // minHeight: 200,
    // lockView: true,
    // mask: true,
    // duration: 3000,
    // marginSize: 0,
    // dblclickZoom: true,
    // showTitleOverflow: true,
    // storage: false
  },
})
Vue.use(VXETable)

Vue.config.productionTip = false

import prototype from '@/utils/prototype'
Vue.use(prototype)

// index.js
import microApp from '@micro-zoe/micro-app'
microApp.start()

//amis自定义组件
// import './amisPligin/index'
//引入指令
import '@/utils/directive/index'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

