import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACK_URL,
  crossdomain: true
})

instance.interceptors.request.use(function (config) {
//   config.url = state.constants.backUrl + config.url
  if (!config.url.includes('authenticate')) {
    config.headers.apiKey = process.env.REACT_APP_API_KEY
    config.headers.refreshToken = process.env.REACT_APP_REFRESH_TOKEN
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// Add a response interceptor
instance.interceptors.response.use(function (response) {
  return response
})
export default instance
