<template>
  <div class="dashboard-container">
    <div class="dashboard-text">vue-amis-fqy</div>
<!--    <monaco-->
<!--        ref="monaco"-->
<!--        :opts="opts"-->
<!--        @change="changeValue"-->
<!--        :isDiff="isDiff"-->
<!--        :height="600"-->
<!--    ></monaco>-->
    <div id="monaco" style="width: 100%;height: 800px;"></div>
  </div>
</template>

<script>
// import monaco from '@/components/monacoeditor/index'
// import * as monaco from 'monaco-editor'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'

// import '../language/json/monaco.contribution';
let monacolnstance
export default {
  name: 'Dashboard',
  // components: {
  //   monaco
  // },
  data(){
    return {
      // opts: {
      //   value: '',
      //   readOnly: false, // 是否可编辑
      //   language: 'JSON', // 语言类型
      //   theme: 'vs-dark' // 编辑器主题
      // },
      // isDiff: true,
    }
  },
  mounted() {
    monacolnstance = monaco.editor.create(document.getElementById('monaco'), {
      value: '{"aa": "11"}',
      language: 'JSON',
      automaticLayout: true, //自动布局
      foldingStrategy: 'auto', //代码折叠 "auto" | "indentation"
      minimap: {
        enabled: false,
      },
      theme: 'hc-black', //官方自带三种主题 vs hc-black, or vs-dark
    })

    console.log( 'mmm === >>>', monacolnstance.getValue() )

    // monacolnstance.trigger('anyString', 'monaco.editor.action.formatDocument')
    // monacolnstance.setValue( monacolnstance.getValue() )

    // monaco.languages.json.jsonDefaults.setDiagnosticsOptions(getMyJsonSchema())
    // monaco.languages.json.jsonDefaults.setDiagnosticsOptions( monacolnstance.getValue() )

    monaco.editor.onDidChangeMarkers(() => {
      console.log( '执行了', "onDidChangeMarkers" )
    })
    monaco.editor.onDidChangeModelLanguage(() => {
      console.log( '执行了', "onDidChangeModelLanguage" )
    })
    // onDidChangeModelLanguage
    console.log( 'www===>>>', monaco )
    //
    // monaco.editor.onDidChangeModelDecorations(() => {
    //   const model = monaco.editor.getModel();
    //   const markers = monaco.editor.getModelMarkers(model);
    //
    //   console.log({ markers })
    // })
  },
  methods: {
    changeValue(){

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
