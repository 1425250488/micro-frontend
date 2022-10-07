<template>
  <microApp :dataForChild="dataForChild"></microApp>
</template>

<script>
  import {getToken} from "@/utils/auth"
  import microApp from "@/components/micro_app"
  export default {
    name: "SonAmis",
    components: { microApp },
    data() {
      return {
        dataForChild: {
          TOKEN: getToken(),
          VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
          URL: this.$route.path
        }
      }
    },
    created() {

    }
  }
</script>

<style scoped>

</style>
