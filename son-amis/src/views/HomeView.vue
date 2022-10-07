<template>
  <div style="width: 100%;height: 100%;">
    <div style="width: 100%;height: 100%;" v-if="!is_hide">
      <div @click="onEdit()" style="width: 40px;height: 40px;background: #409EFF;position: fixed;bottom: 40px;right: 40px;border-radius: 50%;display: flex;justify-content: center;align-items: center;cursor: pointer;z-index: 1000;">
        <i style="font-size: 20px;color: #ffffff;" class="fa fa-pencil-square-o" aria-hidden="true"></i>
      </div>
      <div ref="react" id="react" class="my-amis" style="width: 100%;height: 100%;"></div>
    </div>
    <div v-else></div>
    <amis_editor ref="amisEditor" @close="init"></amis_editor>
  </div>
</template>

<script>
  import { Editor } from 'amis-editor';
  import 'amis-editor/dist/style.css';
  import 'amis/lib/themes/default.css';
  import '@fortawesome/fontawesome-free/css/all.css'
  import '@fortawesome/fontawesome-free/css/v4-shims.css'
  import ReactDOM from 'react-dom'
  import React from 'react'
  import { isJSON } from "@/utils/index"
  import axios from "axios"
  import { GET_TOKEN, GET_VUE_APP_BASE_API } from '@/api/utils'
  import api from '@/api/api'

  import amis_editor from '@/components/amis_editor'
  export default {
    name: "amis",
    components: { amis_editor },
    // computed: {
    //   ...mapState({
    //     info: state => state.user.info
    //   })
    // },
    data(){
      return {
        is_hide: false,
        amis: {
          preview: true,
          amisEnv: {
            fetcher: ({
                        url, // 接口地址
                        method, // 请求方法 get、post、put、delete
                        data, // 请求数据
                        responseType,
                        config, // 其他配置
                        headers // 请求头
                      }) => {
              config = config || {};
              url = GET_VUE_APP_BASE_API() + url
              // config.withCredentials = true;
              responseType && (config.responseType = responseType);

              if (config.cancelExecutor) {
                config.cancelToken = new axios.CancelToken(
                  config.cancelExecutor
                );
              }
              // 加请求头
              // headers['contentType'] = 'application/json'

              config.headers = headers || {};

              // 加token
              config.headers = Object.assign( { authorization: GET_TOKEN(), contentType: 'application/json' }, config.headers )

              if (method !== 'post' && method !== 'put' && method !== 'patch') {
                if (data) {
                  config.params = data;
                }

                return axios[method](url, config);
              } else if (data && data instanceof FormData) {
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'multipart/form-data';
              } else if (
                data &&
                typeof data !== 'string' &&
                !(data instanceof Blob) &&
                !(data instanceof ArrayBuffer)
              ) {
                data = JSON.stringify(data);
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'application/json';
              }

              return axios[method](url, data, config);
            }
          }
        },
        path_flag: 0
      }
    },
    created() {
      if (window.__MICRO_APP_ENVIRONMENT__){
        window.microApp.addDataListener(this.dataListener, true)
      }else {
        this.init()
      }
    },
    beforeDestroy() {
      // 基座参数监听关闭
      if (window.__MICRO_APP_ENVIRONMENT__){
        window.microApp.removeDataListener(this.dataListener)
      }
    },
    methods: {
      dataListener (data) {
        if( window.microApp.getData()?.IS_HIDE ){
          this.is_hide = true
        }else {
          this.is_hide = false
        }
        this.init(data.URL)
        console.log('来自基座应用的数据', data)
        if( data.PATH_FLAG && this.path_flag != data.PATH_FLAG ) {
          this.path_flag = data.PATH_FLAG
          this.onEdit(data.PATH)
        }
      },
      init(URL){
        if( this.is_hide ){
          return
        }
        this.$nextTick(_ => {
          ReactDOM.unmountComponentAtNode(this.$refs.react)
        })
        api.get( `/menu/info`,  { path: URL || this.$route.path }).then(res => {
          if( res.data.json && isJSON(res.data.json) ){
            this.amis.value = JSON.parse( res.data.json )
          }else {
            this.amis.value = {}
          }
          // this.$nextTick(_ => {
            ReactDOM.render(React.createElement(Editor, this.amis), this.$refs.react)
          // })
          // this.$refs.react.parentNode.removeNode()
        })
      },
      onEdit(path){
        console.log( 'www === >>>', this.$refs.amisEditor )

        this.$refs.amisEditor.init( { path: path || window.location.pathname } )
      },

    }
  }
</script>

<style>
  .cxd-Form-item:last-child{
    margin-bottom: calc(var(--Form-item-gap) / 2);
  }
</style>


<!--<template>-->
<!--  <div class="home">-->

<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--// @ is an alias to /src-->


<!--export default {-->
<!--  name: 'HomeView'-->
<!--}-->
<!--</script>-->
