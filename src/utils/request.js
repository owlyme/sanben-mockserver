/**
 * A module representing a service
 * @module service
 */
const axios = require('axios');

const service = axios.create({
  withCredentials: true, // 表明是否有跨域请求需要用到证书
  timeout: 360000,
});
service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.headers.get['Content-Type'] = 'application/json';
// request interceptor
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // console.log(config)
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Promise.reject(error);
  }
);

module.exports = service;
