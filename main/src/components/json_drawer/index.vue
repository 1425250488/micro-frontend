<template>
<!--  size="70%"-->
<!-- v-drawerDrag v-dialogDrag-->
  <el-drawer
    v-dialogDrag
    :visible.sync="drawer"
    title="编辑代码（支持编辑实时预览）"
    custom-class="json-drawer"
    direction="rtl"
    :before-close="handleClose">
    <vue-json-editor
      v-model="resultInfo"
      :showBtns="false"
      :mode="'code'"
      class="vue-json-editor"
      @json-change="onJsonChange"
      @json-save="onJsonSave"
      @has-error="onError"
    />
  </el-drawer>
</template>

<script>
  import vueJsonEditor from 'vue-json-editor'
  export default {
    components: { vueJsonEditor },
    data(){
      return {
        drawer: false,
        hasJsonFlag:true,  // json是否验证通过
        // json数据
        resultInfo: {
          'employees': [
            {
              'firstName': 'Bill',
              'lastName': 'Gates'
            },
            {
              'firstName': 'George',
              'lastName': 'Bush'
            },
            {
              'firstName': 'Thomas',
              'lastName': 'Carter'
            }
          ]
        }
      }
    },
    methods: {
      onJsonChange (value) {
        // console.log('更改value:', value);
        // 实时保存
        this.onJsonSave(value)
      },
      onJsonSave (value) {
        // console.log('保存value:', value);
        this.resultInfo = value
        this.hasJsonFlag = true
      },
      onError(value) {
        // console.log("json错误了value:", value);
        this.hasJsonFlag = false
      },
      // 检查json
      checkJson(){
        if (this.hasJsonFlag == false){
          // console.log("json验证失败")
          // this.$message.error("json验证失败")
          alert("json验证失败")
          return false
        } else {
          // console.log("json验证成功")
          // this.$message.success("json验证成功")
          alert("json验证成功")
          return true
        }
      },
      handleClose(done){
        done()
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      }
    }
  }
</script>

<style>
  .json-drawer .vue-json-editor{
    height: calc( 100vh - 45px );
  }
  .json-drawer .el-drawer__header{
    padding: 10px 20px;
    margin-bottom: 0px
  }
  .json-drawer .jsoneditor-vue{
    height: 100%;
  }
</style>
