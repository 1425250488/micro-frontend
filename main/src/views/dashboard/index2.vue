<!--<template>-->
<!--  <div class="dashboard-container">-->
<!--    <MonacoEditor-->
<!--      height="600"-->
<!--      language="typescript"-->
<!--      :code="code"-->
<!--      :editorOptions="options"-->
<!--      @mounted="onMounted"-->
<!--      @codeChange="onCodeChange"-->
<!--    >-->
<!--&lt;!&ndash;      :jsonSchemas="jsonSchemas"&ndash;&gt;-->
<!--    </MonacoEditor>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import MonacoEditor from 'vue-monaco-webpack'-->
<!--// const jsonSchemas=[require('test1.json'),require('test2.json')]-->
<!--export default {-->
<!--  components: {-->
<!--    MonacoEditor-->
<!--  },-->
<!--  data(){-->
<!--    return {-->
<!--      code: '{"aa": "bb"}',-->
<!--      options: {-->
<!--        selectOnLineNumbers: true,-->
<!--        roundedSelection: false,-->
<!--        readOnly: false,-->
<!--        cursorStyle: 'line',-->
<!--        automaticLayout: false,-->
<!--        glyphMargin: true-->
<!--      },-->
<!--      // jsonSchemas: jsonSchemas-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->

<!--  },-->
<!--  methods: {-->
<!--    onMounted(editor) {-->
<!--      this.editor = editor;-->
<!--    },-->
<!--    onCodeChange(editor) {-->
<!--      console.log(editor.getValue());-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.dashboard {-->
<!--  &-container {-->
<!--    margin: 30px;-->
<!--  }-->
<!--  &-text {-->
<!--    font-size: 30px;-->
<!--    line-height: 46px;-->
<!--  }-->
<!--}-->
<!--</style>-->
