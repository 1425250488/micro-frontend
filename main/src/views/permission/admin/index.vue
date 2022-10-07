<template>
  <div style="padding: 20px;">
    <!--    <el-form class="search" style="flex: 1;width: 100%;" :model="formInline" size="mini" ref="ruleForm" :inline="true">-->
    <!--      <el-form-item label="来源">-->
    <!--        <el-input style="width: 210px;" v-model="formInline.source" @change="search()" clearable></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label-width="0">-->
    <!--        <el-button type="primary" size="mini" @click="search()" icon="el-icon-search">搜索</el-button>-->
    <!--        <el-button type="info" plain size="mini" @click="refresh()">重置</el-button>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="onAdd()">新增管理员</el-button>
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
      <vxe-table-column min-width="80" field="name" title="管理员名称" />
      <vxe-table-column min-width="120" field="phone" title="手机号" />
      <vxe-table-column min-width="80" field="account" title="账号" />
      <vxe-table-column min-width="120" field="roles" title="角色" :formatter="({cellValue}) => cellValue? cellValue.split(',').map(item => options.role_obj[item] || item).join('，'): ''" />
      <vxe-table-column min-width="80" field="status" title="状态" >
        <template v-slot="{ row }">
          <div style="display:flex;align-items: center;">
            <div class="radius-icon" :style="`background: ${ { '1': '#85dc3a','2': '#ff6d6d' }[ row.status ]};`"> </div><div>{{ { '1': '启用','2': '禁用' }[ row.status + '' ] }}</div>
          </div>
        </template>
      </vxe-table-column>

      <vxe-table-column min-width="180" field="create_time" title="创建时间" />
      <vxe-table-column align="left" header-align="center" title="操作" width="100" show-overflow>
        <template v-slot="{ row }">
          <el-link v-show="row.is_admin == 1" type="primary" @click="onEdit(row)">编辑</el-link>
          <el-link v-show="row.is_admin == 1" style="margin-left: 10px;" type="danger" @click="onDel(row)">删除</el-link>
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
<!--    name: '', // 管理员名称-->
<!--    phone: '', // 手机号-->
<!--    account: '', // 用户名-->
<!--    password: '', // 密码-->
<!--    roles: '', // 角色-->
<!--    status: 1 // 1启用 2禁用-->
    <vxe-modal v-model="dialogVisible" :title="title" width="560" class="ruleForm" :position="{top: 100}">
      <el-form ref="ruleForm" size="mini" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="管理员名称" prop="name">
          <el-input v-model="form.name" style="width: 100%;" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" style="width: 100%;" clearable />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" style="width: 100%;" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" style="width: 100%;" clearable :placeholder="form.admin_id? '': '不填默认为账号'" />
        </el-form-item>
        <el-form-item label="角色" prop="password">
          <el-select v-model="form.roles" style="width: 100%;" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in options.role_list"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="note">
          <el-radio-group v-model="form.status">
            <el-radio-button :label="1">启用</el-radio-button>
            <el-radio-button :label="2">禁用</el-radio-button>
          </el-radio-group>
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
import { phone } from '@/utils/rules/index'
export default {
  name: 'Dashboard',
  data() {
    return {
      tableData: [{}, {}, {}, {}],
      loading: false,
      formInline: {
        // source: '',
      },
      page: {
        Sizes: [10, 15, 20, 30, 40, 50, 100, 500],
        size: 10,
        page: 1,
        total: 0
      },
      form: {
        name: '', // 管理员名称
        phone: '', // 手机号
        account: '', // 用户名
        password: '', // 密码
        roles: [], // 角色
        status: 1 // 1启用 2禁用
      },
      rules: {
        name: [
          { required: true, message: '管理员名称必填', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '用户名必填', trigger: 'blur' }
        ],
        phone: [
          { validator: phone, trigger: 'blur' }
        ]
      },
      options: {
        role_list: [],
        role_obj: {}
      },
      dialogVisible: false,
      title: '新增来源'
    }
  },
  created() {
    this.search()
    this.getRole()
  },
  methods: {
    getList(obj) {
      this.loading = true
      this.$api.get('/admin/list', obj).then(res => {
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
        source: '' // 短信平台id
      }
      this.search()
    },
    resetForm() {
      this.form = {
        name: '', // 管理员名称
        phone: '', // 手机号
        account: '', // 用户名
        password: '', // 密码
        roles: [], // 角色
        status: 1 // 1启用 2禁用
      }
      this.$nextTick(_ => {
        if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
      })
    },
    onAdd() {
      this.resetForm()
      this.title = '新增管理员'
      this.dialogVisible = true
    },
    onEdit(row) {
      this.resetForm()
      this.form = {
        admin_id: row.admin_id,
        name: row.name, // 管理员名称
        phone: row.phone, // 手机号
        account: row.account, // 用户名
        password: '', // 密码
        roles: row.roles? row.roles.split(',').map(item => parseInt(item)): [], // 角色
        status: row.status // 1启用 2禁用
      }
      this.title = '编辑管理员'
      this.dialogVisible = true
    },
    onDel(row) {
      this.$confirm('您是否删除当前管理员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        const loading = this.$elLoading({ text: '删除中' })
        this.$api.post('/admin/del', { admin_id: row.admin_id }).then(res => {
          this.$message.success('删除成功')
          this.search(true)
        }).finally(_ => {
          loading.close()
        })
      })
    },
    onSave(flag) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const form = Object.assign({}, this.form)
          form.roles = this.form.roles.length > 0 ? this.form.roles.join(',') : ''
          const loading = this.$elLoading({ text: '保存中' })
          if (this.form.admin_id) {
            this.$api.post('/admin/edit', form).then(res => {
              this.$message.success('保存成功')
              this.dialogVisible = false
              this.search(true)
            }).finally(_ => {
              loading.close()
            })
          } else {
            if (!form.password) form.password = form.account
            this.$api.post('/admin/add', form).then(res => {
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
    getRole() {
      this.$api.get('/role/list', { page: 1, size: 100 }).then(res => {
        this.options.role_list = res.data.list
        let obj = {}
        this.options.role_list.forEach(item => {
          obj[item.role_id] = item.role_name
        })
        this.options.role_obj = obj
        this.tableData = JSON.parse( JSON.stringify(this.tableData) )
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

