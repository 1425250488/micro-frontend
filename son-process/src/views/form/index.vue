<template>
  <div class="app-container">
    <WfdDesign
      v-if="wfdDesignRefresh"
      ref="wfd"
      :users="users"
      :roles="roles"
      :departments="departments"
      :tasks="taskListData"
      :templates="ruleForm.tpls"
      :templates-base="templates"
      :data="ruleForm.structure"
      :height="800"
      :lang="lang"
    />
  </div>
</template>

<script>
export default {
  components: {
    WfdDesign: () => import('@/components/Wfd/components/Wfd')
  },
  data() {
    return {
      wfdDesignRefresh: true,
      ruleForm: {
        tpls: [],
        structure: {
          nodes: [],
          edges: []
        }
      },
      templates: [],
      lang: 'zh',
      users: [
        {
          id: 1,
          name: '用户11_custom'
        }, {
          id: 2,
          name: '用户22_custom'
        }, {
          id: 3,
          name: '用户33_custom'
        }
      ],
      roles: [
        {
          id: 1,
          name: '角色1'
        }, {
          id: 2,
          name: '角色2'
        }, {
          id: 3,
          name: '角色3'
        }
      ],
      departments: [
        {
          id: 1,
          name: '部门1'
        }, {
          id: 2,
          name: '部门2'
        }, {
          id: 3,
          name: '部门3'
        }
      ],
      taskListData: [
        {
          id: 1,
          task: '1',
          name: '任务1'
        }, {
          id: 2,
          task: '2',
          name: '任务2'
        }, {
          id: 3,
          task: '3',
          name: '任务3'
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

