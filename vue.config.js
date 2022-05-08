const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port:9070,
    proxy: {
      '/api': {
        target: 'http://192.168.1.143:9090',
        //target: 'http://192.168.1.195:9090',
        ws: true,
        withCredentials:true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  chainWebpack: config => {

    config.module
        .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker-loader')
        .loader('worker-loader')
        .options({
          inline: 'fallback'
        })

    config.output.globalObject('this')
    config.optimization.delete('splitChunks')
  },

  parallel: false,
  publicPath: '/',

  configureWebpack: {

    devtool: 'source-map',
    performance:{
      maxAssetSize: 30000000,
    }
  },


})
