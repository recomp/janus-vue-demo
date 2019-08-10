let isDev = process.env.NODE_ENV === 'development'

module.exports = {
  publicPath: isDev ? '' : 'janus-vue-demo',
  outputDir: 'dist',
}