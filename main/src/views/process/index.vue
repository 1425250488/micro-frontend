<template>
  <div>
    <micro-app name='son-process' url='http://175.178.87.254/son-process' baseroute='' :data='dataForChild'></micro-app>
<!--    <micro-app name='son-process' url='http://localhost:9529/son-process' baseroute='' :data='dataForChild'></micro-app>-->
  </div>
</template>

<script>
  import {getToken} from "@/utils/auth"

  export default {
    name: "Process",
    data(){
      return {
        dataForChild: {
          TOKEN: getToken(),
          VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
          URL: this.$route.path
        }
      }
    }
  }
</script>

<style scoped>

</style>
