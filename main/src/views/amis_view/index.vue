<!--<template>-->
<!--  <div style="width: 100%;height: 100%;">-->
<!--    <div @click="onEdit()" v-show="info.is_admin == 2" style="width: 40px;height: 40px;background: #409EFF;position: fixed;bottom: 40px;right: 40px;border-radius: 50%;display: flex;justify-content: center;align-items: center;cursor: pointer;z-index: 999999;">-->
<!--      <i style="font-size: 20px;color: #ffffff;" class="fa fa-pencil-square-o" aria-hidden="true"></i>-->
<!--    </div>-->
<!--    <amis_editor ref="amisEditor" @close="init"></amis_editor>-->
<!--    <div ref="react" class="my-amis" style="width: 100%;height: 100%;"></div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import { Editor } from 'amis-editor';-->
<!--  import 'amis-editor/dist/style.css';-->
<!--  import 'amis/lib/themes/default.css';-->
<!--  import '@fortawesome/fontawesome-free/css/all.css'-->
<!--  import '@fortawesome/fontawesome-free/css/v4-shims.css'-->
<!--  import ReactDOM from 'react-dom'-->
<!--  import React from 'react'-->
<!--  import {isJSON} from "@/utils/index"-->
<!--  import axios from "axios"-->
<!--  import {getToken} from "@/utils/auth"-->
<!--  import { mapState } from 'vuex'-->
<!--  import amis_editor from '@/components/amis_editor'-->
<!--  export default {-->
<!--    name: "amis",-->
<!--    components: { amis_editor },-->
<!--    computed: {-->
<!--      ...mapState({-->
<!--        info: state => state.user.info-->
<!--      })-->
<!--    },-->
<!--    data(){-->
<!--      return {-->
<!--        amis: {-->
<!--          preview: true,-->
<!--          amisEnv: {-->
<!--            fetcher: ({-->
<!--                        url, // 接口地址-->
<!--                        method, // 请求方法 get、post、put、delete-->
<!--                        data, // 请求数据-->
<!--                        responseType,-->
<!--                        config, // 其他配置-->
<!--                        headers // 请求头-->
<!--                      }) => {-->
<!--              config = config || {};-->
<!--              url = process.env.VUE_APP_BASE_API + url-->
<!--              // config.withCredentials = true;-->
<!--              responseType && (config.responseType = responseType);-->

<!--              if (config.cancelExecutor) {-->
<!--                config.cancelToken = new axios.CancelToken(-->
<!--                  config.cancelExecutor-->
<!--                );-->
<!--              }-->
<!--              // 加请求头-->
<!--              // headers['contentType'] = 'application/json'-->

<!--              config.headers = headers || {};-->

<!--              // 加token-->
<!--              config.headers = Object.assign( { authorization: getToken(), contentType: 'application/json' }, config.headers )-->

<!--              if (method !== 'post' && method !== 'put' && method !== 'patch') {-->
<!--                if (data) {-->
<!--                  config.params = data;-->
<!--                }-->

<!--                return axios[method](url, config);-->
<!--              } else if (data && data instanceof FormData) {-->
<!--                config.headers = config.headers || {};-->
<!--                config.headers['Content-Type'] = 'multipart/form-data';-->
<!--              } else if (-->
<!--                data &&-->
<!--                typeof data !== 'string' &&-->
<!--                !(data instanceof Blob) &&-->
<!--                !(data instanceof ArrayBuffer)-->
<!--              ) {-->
<!--                data = JSON.stringify(data);-->
<!--                config.headers = config.headers || {};-->
<!--                config.headers['Content-Type'] = 'application/json';-->
<!--              }-->

<!--              return axios[method](url, data, config);-->
<!--            }-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--    created() {-->
<!--      this.init()-->
<!--    },-->
<!--    methods: {-->
<!--      init(){-->
<!--        this.$api.get('/menu/info', { path: window.location.pathname }).then(res => {-->
<!--          if( res.data.json && isJSON(res.data.json) ){-->
<!--            this.amis.value = JSON.parse( res.data.json )-->
<!--          }else {-->
<!--            this.amis.value = {}-->
<!--          }-->
<!--          ReactDOM.render(React.createElement(Editor, this.amis), this.$refs.react)-->
<!--        })-->
<!--      },-->
<!--      onEdit(){-->
<!--        this.$refs.amisEditor.init( { path: window.location.hash.replace('#', '') } )-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->

<!--<style>-->
<!--  .cxd-Form-item:last-child{-->
<!--    margin-bottom: calc(var(&#45;&#45;Form-item-gap) / 2);-->
<!--  }-->
<!--</style>-->
