const { defineConfig } = require('@vue/cli-service');

const Version = new Date().getTime();
const isPro = process.env.NODE_ENV === 'production';
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port:9070,
    proxy: {
      '/api': {
        target: 'http://192.168.1.143:9090',
        //target: 'http://192.168.1.169:9090',
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
    if (isPro) {
      config.plugin('extract-css').tap((args) => [
        {
          filename: `css/[name].${Version}.css`,
          chunkFilename: `css/[name].${Version}.css`,
        },
      ])
    }

    config.module
        .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker-loader')
        .loader('worker-loader')
        .options({
          inline: 'fallback'
        })

    //config.output.globalObject('this')
    //config.optimization.delete('splitChunks')
  },

  parallel: false,
  publicPath: '/',

  configureWebpack: {
    output: {
      filename: `js/[name].${Version}.js`,
      chunkFilename: `js/[name].${Version}.js`,
    },
    //devtool: 'source-map',
    performance:{
      maxAssetSize: 30000000,
    }
  },


})
