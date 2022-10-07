import request from './request'

export default {
  get (url, params) {
    return request({
      url,
      method: 'get',
      params
    })
  },
  post (url, data) {
    return request({
      url,
      method: 'post',
      data
    })
  },
  put (url, data) {
    return request({
      url,
      method: 'put',
      data
    })
  },
  delete (url, params) {
    return request({
      url,
      method: 'delete',
      params
    })
  }
}


