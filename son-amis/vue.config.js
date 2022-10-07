const { defineConfig } = require('@vue/cli-service')
let publicPath = "/go-amis/"
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  publicPath
})
