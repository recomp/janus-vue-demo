var path = require('path')
var webpack = require('webpack');

isDev = process.env.NODE_ENV === 'development'


module.exports = {
  publicPath: isDev ? '' : 'janus-vue-demo',
  outputDir: 'dist',
  css: {
    sourceMap: isDev ? true : false
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, './src')
      }
    }
  },
  devServer: {
    public: 'localhost:8080',
    // sockHost: 'localhost:8080',
    disableHostCheck: false
  }
}