import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import './amisPligin/index'

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
