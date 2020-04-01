import axios from 'axios'
import router from 'vue-router'

axios.defaults.timeout = 100000

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.errCode === 2) {
      router.push({
        path: '/',
        querry: {
          redirect: router.currentRoute.fullPath // 从哪个页面跳转
        }
      })
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'get',
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      headers: {
        'content-type': 'application/json'
      },
      data: data
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

 /**
 * 封装post请求,data为json
 * @param url
 * @param data
 * @returns {Promise}
 */

export function postJson( url, data ){
  return new Promise(( resolve, reject ) => {
    axios({
      method: "post", 
      url: url,
      headers: { 
       'content-type': 'application/json'
      },
      data:data,
    })
     .then(response => {
       resolve(response.data);
     },err => {
       reject(err)
     })
  })
}
