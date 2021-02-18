import axios from 'axios'

axios.defaults.timeout = 60000
// axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.baseURL = 'http://39.105.45.77:8082'
// axios.defaults.baseURL = 'http://127.0.0.1:8092'
// axios.defaults.baseURL = '/api'

// token
// axios.defaults.headers.common['Authentication-Token'] = store.state.token;

// http://39.105.45.77:8089
// 请求拦截器
// axios.interceptors.request.use(
//   config => {
//     config.data = JSON.stringify(config.data);
//     // config.headers = {
//     //   'Content-Type': 'application/x-www-form-urlencoded'
//     // }
//     return config
//   }, error => {
//     return Promise.reject(error)
//   }
// )

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('token')) {
      config.headers.token = sessionStorage.getItem('token')
    }
    // console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  })

// 响应拦截器
// axios.interceptors.response.use(
//   response => {
//     // console.log(response);
//     return response;
//   },
//   error => Promise.reject(error)
// )

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params
    })
      .then(data => {
        resolve(data.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
