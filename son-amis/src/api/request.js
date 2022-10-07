import axios from 'axios'
import { Message } from 'element-ui'
import { GET_TOKEN, GET_VUE_APP_BASE_API } from './utils'

const service = axios.create({
  baseURL: GET_VUE_APP_BASE_API(), // url = base url + request url
  timeout:  30000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (GET_TOKEN()) {
      config.headers['authorization'] = GET_TOKEN()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.code === 401) {
        console.log('登录过期')
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
