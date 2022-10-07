<template>
  <vxe-modal :transfer="true" ref="amisEditor" v-model="dialogVisible" class="amis-editor" :show-header="false" :fullscreen="true">
    <div style="height: 100%">
      <div style="height: 40px;display: flex;align-items: center;justify-content: space-between;padding: 0 10px;">
        <div style="width: 300px;font-size: 16px;font-weight: 600;">
          {{ menu_name }}
          <a style="color: #205dd9;font-size: 13px;text-decoration:underline;margin-left: 6px;" href="https://aisuda.bce.baidu.com/amis/zh-CN/docs/start/getting-started" target="_blank">文档链接</a>
        </div>
        <div>
          <div class="Editor-view-mode-group-container">
            <div class="Editor-view-mode-group">
              <div
                :class="['Editor-view-mode-btn', {'is-active': !amis.isMobile}]"
                @click="() => { amis.isMobile = false; onRender() }"
              >
                <!--              <d2-icon-svg style="width: 100%;height: 100%;" name="pc-preview"/>-->
                PC
              </div>
              <div
                class="Editor-view-mode-btn"
                :class="['Editor-view-mode-btn', {'is-active': amis.isMobile}]"
                @click="() => { amis.isMobile = true; onRender() }"
              >
                <!--              <d2-icon-svg style="width: 100%;height: 100%;" name="h5-preview"/>-->
                移动
              </div>
            </div>
          </div>
        </div>
        <div style="width: 300px;text-align: right;">
          <button type="button" style="margin-left: 10px;" class="cxd-Button cxd-Button--primary" @click="onSave(false)"><span>保存</span></button>
          <button type="button" style="margin-left: 10px;" class="cxd-Button cxd-Button--primary" @click="onSave(true)"><span>保存&退出</span></button>
          <button v-show="!amis.preview" type="button" style="margin-left: 10px;" class="cxd-Button cxd-Button--primary" @click="() => { amis.preview = true; onRender() }"><span>预览</span></button>
          <button v-show="amis.preview" type="button" style="margin-left: 10px;" class="cxd-Button cxd-Button--primary" @click="() => { amis.preview = false; onRender() }"><span>编辑</span></button>
          <button type="button" style="margin-left: 10px;" class="cxd-Button cxd-Button--primary" @click="dialogVisible = false"><span>退出</span></button>
        </div>
      </div>
      <div ref="react" class="my-amis" />
    </div>
  </vxe-modal>
</template>

<script>
import { Editor } from 'amis-editor'
import 'amis-editor/dist/style.css'
import 'amis/lib/themes/default.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/v4-shims.css'

import ReactDOM from 'react-dom'
import React from 'react'
import { isJSON } from '@/utils/index'
import axios from 'axios'
import {getToken} from "@/utils/auth"
export default {
  data() {
    return {
      dialogVisible: false,
      menu_name: '',
      menu_id: '',
      amis: {
        // 是否是预览模式
        preview: false,
        $schemaUrl: 'http:baidu.com',
        // 数据源
        value: {
          // type: "page",
          // title: "测试"
        },
        // 改变事件
        onChange: this.onChange,
        // 是否是手机模式
        isMobile: false,

        isSubEditor: false,

        // 数据源过滤器
        schemaFilter: (e) => {
          console.log('11111', e)
          // e.body.body[0].label = '1111'
          return e
        },

        // 自定义单独一列
        showCustomRenderersPanel: true,

        // 主题
        theme: 'cxd', // 目前支持是三种主题：default、cxd 和 dark

        amisEnv: {
          fetcher: ({
            url, // 接口地址
            method, // 请求方法 get、post、put、delete
            data, // 请求数据
            responseType,
            config, // 其他配置
            headers // 请求头
          }) => {
            config = config || {}
            config.withCredentials = true
            responseType && (config.responseType = responseType)

            if (config.cancelExecutor) {
              config.cancelToken = new axios.CancelToken(
                config.cancelExecutor
              )
            }

            config.headers = headers || {}

            // 加token
            config.headers = Object.assign( { authorization: getToken() }, config.headers )

            if (method !== 'post' && method !== 'put' && method !== 'patch') {
              if (data) {
                config.params = data
              }

              return axios[method](url, config)
            } else if (data && data instanceof FormData) {
              config.headers = config.headers || {}
              config.headers['Content-Type'] = 'multipart/form-data'
            } else if (
              data &&
                typeof data !== 'string' &&
                !(data instanceof Blob) &&
                !(data instanceof ArrayBuffer)
            ) {
              data = JSON.stringify(data)
              config.headers = config.headers || {}
              config.headers['Content-Type'] = 'application/json'
            }

            return axios[method](url, data, config)
          }
        }
      }
    }
  },
  mounted() {
    // this.dialogVisible = true
    // this.$nextTick(_ => {
    //   setTimeout(_ => {
    //     // this.amis.value = {}
    //     // 如果窗口处于常规状态，则最大化窗口
    //     this.$refs.amisEditor.maximize()
    //     this.onRender()
    //   }, 1000)
    // })
  },
  methods: {
    onSave( flag = false ) {
      const loading = this.$elLoading({ text: '保存' })
      this.$api.post('/menu/edit', { menu_id: this.menu_id, json: JSON.stringify(this.amis.value) }).then(res => {
        this.$message.success('保存成功')
        if( flag ) {
          this.dialogVisible = false
          this.$emit('close')
        }
      }).finally(_ => {
        loading.close()
      })
    },
    onChange(e) {
      this.amis.value = e
    },
    init(row) {
      this.$api.get('/menu/info', { menu_id: row.menu_id || undefined, path: row.path || undefined }).then(res => {
        this.menu_id = res.data.menu_id
        this.menu_name = res.data.menu_name
        if ( res.data.json && isJSON(res.data.json) ){
          this.amis.value = JSON.parse(res.data.json)
        }else {
          this.amis.value = {}
        }
        this.dialogVisible = true
        this.$nextTick(_ => {
          // 如果窗口处于常规状态，则最大化窗口
          this.$refs.amisEditor.maximize()
          this.onRender()
        })
      })
    },
    onRender() {
      ReactDOM.render(React.createElement(Editor, this.amis), this.$refs.react)
    }
  }
}
</script>

<style>
  .amis-editor{
    z-index: 1200 !important;
  }
  .amis-editor .vxe-modal--content{
    padding: 0px !important;
    max-height: calc(100% - 10px) !important;
  }
  .amis-editor .vxe-modal--body{
    padding: 0px !important;
  }

  .my-amis{
    height: calc(100% - 40px);
    box-shadow: 2px 0 20px 0 rgba(0,0,0,.1);
    /*box-shadow: black 0 0 10px;*/
  }
  .my-amis .ae-Editor{
    height: 100%;
  }
</style>

<style scoped lang="scss">
  .Editor-view-mode-group-container {
    flex: 0 1 150px;
    display: flex;
    justify-content: center;
    align-items: center;

    .Editor-view-mode-group {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      letter-spacing: 0;
      text-align: center;
      width: 100px;
      height: 32px;
      border-radius: 4px;
      font-weight: 400;
      background-color: #f2f2f4;

      display: flex;
      justify-content: center;
      align-items: center;

      .Editor-view-mode-btn {
        user-select: none;
        padding: 0;
        border-radius: 4px;
        width: 40px;
        height: 24px;
        cursor: pointer;
        transition: transform ease-out 0.2s;
        display: inline-flex;
        justify-content: center;
        align-items: center;

        &:hover {
          background-color: #f2f2f4;
        }

        svg {
          color: #151b26;
        }

        &:first-child {
          margin-right: 12px;
        }

        &:hover > svg {
          color: #2468f2;
        }

        &.is-active {
          background: #2468f2;
          color: #ffffff;
          svg {
            color: #fff;
          }

          &:hover {
            background: #5086f5;
          }
        }
      }
    }
  }
</style>
