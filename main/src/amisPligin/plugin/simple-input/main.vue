<template>
  <div>
    <input v-model="value1" @input="onAaa"></input>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return {
        value1: '11',
      }
    },
    methods: {
      onAaa( e ){
        this._props.onChange('1111111111')
      }
    }
  }
</script>

<style scoped>

</style>
