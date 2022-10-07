<template>
  <div style="padding: 20px;">
    <el-form class="search" style="flex: 1;width: 100%;" :model="formInline" size="mini" :inline="true">
      <el-form-item label="角色名称">
        <el-input style="width: 210px;" v-model="formInline.role_name" @change="search()" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formInline.status" @change="search()">
          <el-radio-button :label="''">全部</el-radio-button>
          <el-radio-button :label="1">启用</el-radio-button>
          <el-radio-button :label="2">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="onAdd()">新增角色</el-button>
      </div>
      <div style="display: flex;justify-content: flex-end;">
        <vxe-toolbar style="width: fit-content;" export />
        <vxe-toolbar style="width: fit-content;margin-left: 10px;" print />
        <vxe-toolbar style="width: fit-content;margin-left: 10px;" :refresh="{query: refresh}" custom />
      </div>
    </div>
    <vxe-table
      id="register-registered-id"
      ref="xTable"
      :data="tableData"
      :export-config="{filename:$route.meta.title, modes: ['current']}"
      :custom-config="{ storage: { visible: true, resizable: true }}"
      :print-config="{sheetName:$route.meta.title, modes: ['current']}"
      :loading="loading"
      class="tableBox"
    >
      <vxe-table-column type="seq" width="60" title="序" />
      <vxe-table-column min-width="80" field="role_name" title="角色名称" />
      <vxe-table-column min-width="80" field="rules" title="权限" />
      <vxe-table-column min-width="120" field="note" title="备注" />
      <vxe-table-column min-width="80" field="status" title="状态" >
        <template v-slot="{ row }">
          <div style="display:flex;align-items: center;">
            <div class="radius-icon" :style="`background: ${ { '1': '#85dc3a','2': '#ff6d6d' }[ row.status ]};`"> </div><div>{{ { '1': '启用','2': '禁用' }[ row.status + '' ] }}</div>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column min-width="120" field="create_time" title="创建时间" />
      <vxe-table-column align="left" header-align="center" title="操作" width="100" show-overflow>
        <template v-slot="{ row }">
          <el-link type="primary" @click="onEdit(row)">编辑</el-link>
          <el-link style="margin-left: 10px;" type="danger" @click="onDel(row)">删除</el-link>
        </template>
      </vxe-table-column>
    </vxe-table>
    <el-pagination
      background
      :current-page="page.page"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      style="margin-top: 10px;text-align: right;"
      :page-sizes="page.Sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <vxe-modal v-model="dialogVisible" :title="title" width="840" :position="{top: '0px'}">
      <el-form ref="ruleForm" size="mini" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" style="width: 100%;" clearable />
        </el-form-item>
        <el-form-item label="菜单" prop="role_id">
          <el-tree
            ref="tree"
            :default-checked-keys="defaultChecked"
            node-key="menu_id"
            show-checkbox
            :data="options.menu_list"
            :props="{ children: 'children',label: 'menu_name'}"
          />
        </el-form-item>
        <el-form-item label="状态" prop="note">
          <el-radio-group v-model="form.status">
            <el-radio-button :label="1">启用</el-radio-button>
            <el-radio-button :label="2">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" type="textarea" style="width: 100%;" clearable />
        </el-form-item>

        <el-form-item label-width="0px" style="text-align: right;">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSave()">保存</el-button>
        </el-form-item>
      </el-form>
    </vxe-modal>
  </div>
</template>

<script>
import { listToTree } from '@/utils/index'

export default {
  name: 'Dashboard',
  data() {
    return {
      tableData: [{}, {}, {}, {}],
      loading: false,
      formInline: {
        role_name: '', // 角色名称
        status: ''
      },
      page: this.$page,
      form: {
        role_name: '', // 角色名称
        rules: [], // 权限
        status: 1, // 状态 1启用 2禁用
        note: '' // 备注
      },
      rules: {
        role_name: [
          { required: true, message: '角色名称必填', trigger: 'blur' }
        ]
      },
      options: {
        menu_list: []
      },
      dialogVisible: false,
      title: '新增角色',
      defaultChecked: []
    }
  },
  created() {
    this.search()
    this.getMenu()
  },
  methods: {
    getList(obj) {
      this.loading = true
      this.$api.get('/role/list', obj).then(res => {
        this.page.total = res.data.total
        this.tableData = res.data.list
      }).finally(_ => {
        this.loading = false
      })
    },
    search(e = false) {
      if (!e) {
        this.page.page = 1
      }
      this.getList(Object.assign({ page: this.page.page, size: this.page.size }, this.formInline))
    },
    refresh() {
      this.formInline = {
        role_name: '', // 角色名称
        status: ''
      }
      this.search()
    },
    resetForm() {
      this.form = {
        role_name: '', // 角色名称
        rules: [], // 权限
        status: 1, // 状态 1启用 2禁用
        note: '' // 备注
      }
      this.$nextTick(_ => {
        if (this.$refs.tree) this.$refs.tree.setCheckedKeys([])
        if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
      })
    },
    onAdd() {
      this.resetForm()
      this.title = '新增角色'
      this.dialogVisible = true
    },
    onEdit(row) {
      console.log('row === >>>', row)
      this.resetForm()
      this.form = {
        role_id: row.role_id,
        role_name: row.role_name, // 角色名称
        rules: [], // 权限
        status: row.status,
        note: row.note // 评论
      }
      this.title = '编辑角色'
      this.dialogVisible = true
      this.$nextTick(_ => {
        this.defaultChecked = row.rules.split(',').map(item => parseInt(item))
      })
    },
    onDel(row) {
      this.$confirm('您是否删除当前角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        const loading = this.$elLoading({ text: '删除中' })
        this.$api.post('/role/del', { role_id: row.role_id }).then(res => {
          this.$message.success('删除成功')
          this.search(true)
        }).finally(_ => {
          loading.close()
        })
      })
    },
    onSave() {
      // console.log( 'www===>>>', this.$refs.tree.getHalfCheckedKeys() )
      this.form.rules = [ ...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys() ]
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const loading = this.$elLoading({ text: '保存中' })
          if (this.form.role_id) {
            this.$api.post('/role/edit', this.form).then(res => {
              this.$message.success('编辑成功')
              this.dialogVisible = false
              this.search(true)
            }).finally(_ => {
              loading.close()
            })
          } else {
            this.$api.post('/role/add', this.form).then(res => {
              this.$message.success('保存成功')
              this.dialogVisible = false
              this.search(true)
            }).finally(_ => {
              loading.close()
            })
          }
        }
      })
    },
    getMenu() {
      this.$api.get('/menu/list', { page: 1, size: 1000 }).then(res => {
        this.options.menu_list = listToTree(res.data, { keyValue: 'menu_id', keyPid: 'pid' })
        // console.log('www===>>>', this.options.menu_list)
        console.log('res', res)
      })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.search(true)
    },
    handleCurrentChange(val) {
      this.page.page = val
      this.search(true)
    }
  }
}
</script>

<style scoped>

</style>
