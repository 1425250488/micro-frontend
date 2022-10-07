<template>
  <micro-app keep-alive name='go-amis' url='http://175.178.87.254/son-amis' baseroute='' :data='dataForChild'></micro-app>
</template>

<script>
  import {getToken} from "@/utils/auth"

  export default {
    name: "index",
    props: {
      dataForChild: {
        type: Object,
        default: () => {
          return {
            TOKEN: getToken(),
            VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
            URL: this.$route.path
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
