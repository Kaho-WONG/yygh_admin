'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  // BASE_API: '"http://192.168.200.133:9001"', //centos虚拟机中的nginx地址和端口
  BASE_API: '"http://localhost:80"', //本机(windows)的Spring Cloud Gateway服务所在地址和端口(可以不加80)
})
