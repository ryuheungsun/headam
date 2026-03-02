const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',   
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://43.200.78.228:8080',
        changeOrigin: true
      }
    }
  }
})