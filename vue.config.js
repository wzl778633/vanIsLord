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
  chainWebpack: config => {
    // 配置
    config.module
        .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker-loader')
        .loader('worker-loader')
        .options({
          inline: 'fallback'
        })
    // 解决 "window is undefined", 这是因为 worker 线程中不存在 window 对象, 要用 this 代替: (不过我的项目中配置了这个也不行, 用的 self 代替, 后面介绍)
    config.output.globalObject('this')
  },
  // 解决打包的时报错: (由于一些原因我的项目最后没有使用 worker, 也就没有研究打包遇到的问题...)
  parallel: false,

  configureWebpack: {

    devtool: 'source-map',
    performance:{
      maxAssetSize: 30000000,

    }
  },


})
