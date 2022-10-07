<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  //.ruleForm .el-form-item__error{
  //  top: 18px;
  //}
  .tableBox {
    font-size: 12px !important;
    //td {
    //  padding: 6px 0 !important;
    //}
    //th {
    //  padding: 6px 0 !important;
    //}
    .el-table__fixed-right {
      height: 100% !important; //设置高优先，以覆盖内联样式
    }
    .el-button{
      height: 24px !important;
      padding: 5px 15px !important;
    }
    .vxe-footer--row{
      font-weight: 700;
    }

  }
  .vxe-modal--content{
    max-height: calc( 100vh - 40px );
    overflow: auto;
  }

  // 修复vxe-modal 嵌套 el-form 表单
  .vxe-modal--wrapper .vxe-modal--content{
    white-space: normal !important;
  }

  // 修改element loading 全局加载样式
  .my-el-loading{
    position: relative;
    .el-loading-spinner{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50px, -50px);
      background: rgba(255, 255, 255, 0.7);
      height: 100px;
      width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 50%;
      border: 5px solid rgba(0, 0, 0, 0.1);
    }
  }

  // 小圆点
  .radius-icon{
    margin-right: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
</style>
