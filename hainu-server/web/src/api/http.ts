/**
 * HTTP 实例 — 统一 axios 封装
 * 开发环境经 vite 代理到本地后端，生产环境同域部署
 */
import axios from 'axios'

const api = axios.create({ baseURL: '/api/v1', timeout: 15000 })

// 请求拦截：附加登录态
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

// 响应拦截：统一解包 {code,message,data}；未登录跳转登录页
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.data?.code === 40010) {
      localStorage.removeItem('token')
      if (location.pathname !== '/login') location.href = '/login'
    }
    return Promise.reject(err.response?.data || { code: 50000, message: '网络异常，请稍后重试' })
  },
)

export default api
