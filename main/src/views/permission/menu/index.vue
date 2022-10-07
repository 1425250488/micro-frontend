<template>
  <div style="padding: 20px;">
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="onAdd()">新增菜单</el-button>
        <el-button type="primary" size="mini" @click="$refs.menu.setAllTreeExpand(true)">展开所有</el-button>
        <el-button type="primary" size="mini" @click="$refs.menu.clearTreeExpand()">关闭所有</el-button>
      </div>
      <div style="display: flex;justify-content: flex-end;">
        <vxe-toolbar style="width: fit-content;" export />
        <vxe-toolbar style="width: fit-content;margin-left: 10px;" print />
        <vxe-toolbar style="width: fit-content;margin-left: 10px;" :refresh="{query: refresh}" custom />
      </div>
    </div>
    <vxe-table
      id="menu"
      ref="menu"
      keep-source
      :data="tableData"
      row-id="menu_id"
      :loading="loading"
      class="tableBox"
      :tree-config="{children: 'children', reserve: true}"
      :export-config="{filename:$route.meta.title, modes: ['current']}"
      :custom-config="{ storage: { visible: true, resizable: true }}"
      :print-config="{sheetName:$route.meta.title, modes: ['current']}"
      :checkbox-config="{ checkStrictly: true }"
    >
      <vxe-table-column field="menu_name" title="菜单名称" align="left" tree-node min-width="180" />
      <vxe-table-column field="icon" title="图标" min-width="80" />
      <vxe-table-column field="path" title="路径" min-width="80" />
      <vxe-table-column field="router_name" title="路由名称" min-width="180" />
      <vxe-table-column field="router_url" title="路由路径" min-width="180" />
      <vxe-table-column field="router_auth" title="权限验证" min-width="80" :formatter="({cellValue, row}) => row.router_url? options.router_auth_obj[cellValue]: ''" />
      <vxe-table-column field="router_cache" title="页面缓存" min-width="80" :formatter="({cellValue, row}) => row.router_url? options.router_auth_obj[cellValue]: ''" />
      <vxe-table-column field="sort" title="排序" min-width="80" />
      <vxe-table-column field="is_show" title="是否显示" min-width="80" :formatter="({cellValue}) => options.is_show_obj[cellValue]" />
      <vxe-table-column field="note" title="备注" min-width="80" />
      <vxe-table-column align="left" header-align="center" title="操作" width="170" show-overflow>
        <template v-slot="{ row }">
          <el-link v-show="row.preset == 2" type="primary" @click="onAdd(row.menu_id)">下级</el-link>
          <el-link v-show="row.preset == 2" style="margin-left: 10px;" type="primary" @click="onEdit(row)">编辑</el-link>
          <el-link v-show="row.preset == 2" style="margin-left: 10px;" type="danger" @click="onDel(row)">删除</el-link>
          <el-link v-show="row.preset == 2" style="margin-left: 10px;" type="primary" @click="onDesign(row)">设计</el-link>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-modal v-model="dialogVisible" :title="title" width="560" class="ruleForm" :position="{top: 100}">
      <el-form ref="ruleForm" size="mini" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="上级菜单" prop="pid">
          <el-cascader
            v-model="fromValue"
            style="width: 100%;"
            :props="{ checkStrictly: true, value:'menu_id', label: 'menu_name' }"
            size="mini"
            :options="[{menu_id: 0, menu_name: '顶级'}, ...tableData]"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="form.menu_name" style="width: 100%;" clearable />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" style="width: 100%;" clearable />
        </el-form-item>
        <el-form-item label="路由名称" prop="router_name">
          <el-input v-model="form.router_name" style="width: 100%;" clearable />
        </el-form-item>
        <el-form-item label="路由路径" prop="router_url">
          <el-input v-model="form.router_url" style="width: 100%;" clearable />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" style="width: 100%;" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number style="width: 100%;" v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="权限验证" prop="router_auth">
          <el-radio-group v-model="form.router_auth">
            <el-radio-button v-for="(item, index) in options.router_auth_list" :key="index" :label="item.value">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="页面缓存" prop="router_cache">
          <el-radio-group v-model="form.router_cache">
            <el-radio-button v-for="(item, index) in options.router_auth_list" :key="index" :label="item.value">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示" prop="is_show">
          <el-radio-group v-model="form.is_show">
            <el-radio-button v-for="(item, index) in options.is_show_list" :key="index" :label="item.value">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" type="textarea" style="width: 100%;" clearable />
        </el-form-item>

        <el-form-item label-width="0px" style="text-align: right;">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSave()">保存</el-button>
          <el-button v-show="!form.menu_id" type="primary" @click="onSave(true)">保存&新增</el-button>
        </el-form-item>
      </el-form>
    </vxe-modal>
<!--    <amis_editor ref="amisEditor"></amis_editor>-->
<!--    <micro-app name='app111' url='http://10.1.7.140:8082/' baseroute='' :data='dataForChild'></micro-app>-->
    <micro-app :dataForChild="dataForChild"></micro-app>
  </div>
</template>

<script>
import { listToTree } from '@/utils/index'
import {getToken} from "@/utils/auth"
// import amis_editor from '@/components/amis_editor'
import microApp from "@/components/micro_app"
export default {
  name: 'Dashboard',
  // components: { amis_editor },
  components: { microApp },
  data() {
    return {
      dataForChild: {
        TOKEN: getToken(),
        VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
        IS_HIDE: true,
        PATH_FLAG: 0,
        PATH: '',
      },
      tableList: [],
      tableData: [],
      loading: true,
      formInline: {
        // source: '',
      },
      page: this.$page,
      form: {
        pid: '',
        menu_name: '', // 菜单名称
        icon: '', // 图标
        path: '', // 路径
        router_name: '', // 路由名称
        router_url: '', // 路由路径
        router_auth: 1, // 权限验证
        router_cache: 1, // 页面缓存
        sort: 0, // 排序
        is_show: 1, // 是否显示
        note: '' // 备注
      },
      fromValue: [], // 上级菜单
      rules: {
        menu_name: [
          { required: true, message: '菜单名称必填', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路径必填', trigger: 'blur' }
        ]
        // ,
        // router_name: [
        //   { required: true, message: '路由名称必填', trigger: 'blur' }
        // ],
        // router_url: [
        //   { required: true, message: '路由路径必填', trigger: 'blur' }
        // ]
      },
      options: {
        type_list: [
          { value: 1, label: '主菜单' },
          { value: 2, label: '子菜单' },
          { value: 3, label: '隐藏菜单' },
          { value: 4, label: '操作路由' }
        ],
        type_obj: {
          1: '主菜单',
          2: '子菜单',
          3: '隐藏菜单',
          4: '操作路由'
        },
        router_auth_list: [
          { value: 1, label: '开启' },
          { value: 2, label: '关闭' }
        ],
        router_auth_obj: {
          1: '开启',
          2: '关闭'
        },
        is_show_list: [
          { value: 1, label: '显示' },
          { value: 2, label: '隐藏' }
        ],
        is_show_obj: {
          1: '显示',
          2: '隐藏'
        }
      },
      dialogVisible: false,
      title: '新增菜单'
    }
  },
  created() {
    this.search()
  },
  methods: {
    getList(obj) {
      this.loading = true
      this.$api.get('/menu/list', obj).then(res => {
        this.tableList = res.data
        this.tableData = listToTree(res.data, { keyValue: 'menu_id', keyPid: 'pid' })
      }).finally(_ => {
        this.loading = false
      })
    },
    search(e = false) {
      if (!e) {
        this.page.page = 1
      }
      this.getList(this.formInline)
      // this.getList(Object.assign({page: this.page.page, size: this.page.size}, this.formInline))
    },
    refresh() {
      this.formInline = {
        // source: '' // 短信平台id
      }
      this.search()
    },
    resetForm() {
      this.form = {
        pid: '',
        menu_name: '', // 菜单名称
        icon: '', // 图标
        path: '', // 路径
        router_name: '', // 路由名称
        router_url: '', // 路由路径
        router_auth: 1, // 权限验证
        router_cache: 1, // 页面缓存
        sort: new Date().getTime(), // 排序
        is_show: 1, // 是否显示
        note: '' // 备注
      }
      this.fromValue = [0]
      this.$nextTick(_ => {
        if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
      })
    },
    findPid(menu_id) {
      const tableList = this.tableList
      const pidList = []
      function ff(id) {
        pidList.unshift(id)
        const row = tableList.find(item => item.menu_id == id)
        if (row.pid) {
          ff(row.pid)
        }
      }
      ff(menu_id)
      this.fromValue = pidList
    },
    onAdd(menu_id) {
      this.resetForm()
      if (menu_id) {
        this.findPid(menu_id)
      }
      this.title = '新增菜单'
      this.dialogVisible = true
    },
    onEdit(row) {
      this.resetForm()
      if (row.pid != 0) {
        this.findPid(row.pid)
      }
      this.form = {
        pid: row.pid,
        menu_id: row.menu_id,
        menu_name: row.menu_name,
        icon: row.icon,
        path: row.path,
        router_name: row.router_name,
        router_url: row.router_url,
        router_auth: row.router_auth,
        router_cache: row.router_cache,
        sort: row.sort,
        is_show: row.is_show,
        note: row.note
      }
      this.title = '编辑菜单'
      this.dialogVisible = true
    },
    onDel(row) {
      this.$confirm('您是否删除当前菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        const menu_id_list = [row.menu_id]
        function aaa(list) {
          list.forEach(item => {
            menu_id_list.push(item.menu_id)
            if (item.children && item.children.length > 0) {
              aaa(item.children)
            }
          })
        }
        if (row.children && row.children.length > 0) aaa(row.children)
        const loading = this.$elLoading({ text: '删除中' })
        this.$api.post('/menu/del', { menu_ids: menu_id_list.join(',') }).then(res => {
          this.$message.success('删除成功')
          this.search(true)
        }).finally(_ => {
          loading.close()
        })
      })
    },
    onSave(flag = false) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const loading = this.$elLoading({ text: '保存中' })
          this.form.pid = this.fromValue[ this.fromValue.length - 1 ]
          if (this.form.menu_id) {
            this.$api.post('/menu/edit', this.form).then(res => {
              this.$message.success('保存成功')
              this.dialogVisible = false
              this.search(true)
            }).finally(_ => {
              loading.close()
            })
          } else {
            this.$api.post('/menu/add', this.form).then(res => {
              this.$message.success('保存成功')
              this.dialogVisible = false
              this.search(true)
              if (flag) this.onAdd(this.form.pid)
            }).finally(_ => {
              loading.close()
            })
          }
        }
      })
    },
    onDesign(row) {
      this.dataForChild = {
        TOKEN: getToken(),
        VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
        IS_HIDE: true,
        PATH_FLAG: this.dataForChild.PATH_FLAG + 1,
        PATH: row.path
      }


      // this.$refs.amisEditor.init(row)

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
