const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port:9070,
    open:true,
    proxy: {
      '/api': {
        target: 'http://192.168.1.143:9090',
        ws: true,
        withCredentials:true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {

    devtool: 'source-map',

  },

})
