<template>
  <div>
    <vxe-pulldown :transfer="transfer" style="width: 100%;" :placement="placement" class="xp-drop_down_filter" ref="pulldown">
      <template #default>
<!--        @keyup.enter.native="inputEnter"-->
        <vxe-input size="mini" @keyup.tab.native="" ref="refInput1" :disabled="disabled" @keyup.right.native="inputEnter" v-model="searchValue" :suffix-icon="faSearch" placeholder="名称/简拼/全拼" @focus="pulldownFocus($event)" @blur="pulldownBlur($event)" style="width: 100%;"></vxe-input>
      </template>
      <template #dropdown>
        <div class="drop-down-filter-dropdown">
          <vxe-grid
            size="mini"
            border
            auto-resize
            height="auto"
            :row-config="{isHover: true}"
            :show-overflow="true"
            :loading="tableLoading"
            :show-header="showHeader"
            :data="computedDateTable"
            :columns="tableColumn"
            :keyboard-config="{isArrow: true}"
            highlight-current-row
            style="cursor:pointer !important;"
            @cell-click="cellClickEvent"
            :header-cell-style="{background:'#f0f6fd',color:'#606266',borderRight: '1px solid #e8eaec'}"
            ref="pulldownTable"
            :height="height"
          >
          </vxe-grid>
        </div>
      </template>
    </vxe-pulldown>
  </div>
</template>

<script>
  import { source } from './data'
  import { Pulldown, Input, Grid } from 'vxe-table'
  export default {
    components: {
      vxePulldown: Pulldown,
      vxeInput: Input,
      vxeGrid: Grid
    },
    data() {
      return {
        searchValue: '',
        row: {},
        timer: '',
        searchCondition: [],
        inputValue: 'sp_name',
        tableLoading: false,
        // 下拉数据源
        tableDate: source,
        // 表头设置
        tableColumn: [
          { minWidth: '230', field: 'sp_name', title: '商品名' },
          { minWidth: '50', field: 'is_pihao', title: '批' },
          { minWidth: '50', field: 'is_serial', title: '序' },
          { minWidth: '90', field: 'sp_class_name', title: '商品类型' },
          { minWidth: '100', field: 'gg_xiaoshou', title: '规格' },
          { minWidth: '100', field: 'dw_xiaoshou', title: '商品名' },
          { minWidth: '100', field: 'cgj', title: '采购价', align: 'right', headerAlign: 'center' },
          { minWidth: '100', field: 'xsj', title: '销售价', align: 'right', headerAlign: 'center' },
          { minWidth: '200', field: 'yp_manufacturer', title: '生产厂家' }
        ],
        // 方向
        placement: 'button',
        // 是否禁用
        disabled: false,
        // 是否显示表头
        showHeader: true,
        // 图标
        faSearch: 'fa fa-search',
        // 筛选框高度
        height: '300px',
        // 是否将弹框容器插入于 body
        transfer: true
      }
    },
    props: {

    },
    watch: {
      searchValue(newVal, oldVal) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$emit('remoteMethod', newVal)
        }, 300)

      }
    },
    created() {
    },
    mounted() {
      // console.log( 'this ===== >>>>>', this )
    },
    computed: {
      computedDateTable(){
        let value = this.searchValue
        this.$nextTick(() => {
          this.$refs.pulldownTable?.focus()
          this.$refs.pulldownTable?.setCurrentRow(this.computedDateTable[0])
        })
        if (this.tableDate.length == 0 || this.searchCondition.length == 0){
          return this.tableDate
        }else {
          return this.tableDate.filter(item => {
            return this.searchCondition.some(it => {
              if (it.isCase){
                return item[it.key] && ( item[it.key].toLowerCase().indexOf(value) !== -1 || item[it.key].toUpperCase().indexOf(value) !== -1 )
              }else {
                return item[it.key] && item[it.key].indexOf(value) !== -1
              }
            })
          })
        }
      }
    },


    methods: {
      // enter选中值
      inputEnter(){
        this.row = this.$refs.pulldownTable.getCurrentRecord()
        this.$emit('inputEnter', {row: this.row})
        this.$emit('change', this.row)
        this.tabNext()
        this._props.onChange( this.row[this.inputValue] )
      },
      // 点击获取值
      cellClickEvent({row}) {
        this.row = row
        this.$emit('cellClickEvent', {row})
        this.$emit('change', this.row)
        this.tabNext()
        this._props.onChange( this.row[this.inputValue] )
      },
      // 重置
      reset(){
        this.searchValue = ''
      },
      // tab选取下一个时，隐藏输入框，重置搜索显示值 @keyup.tab.native
      tabNext(){
        this.$refs.pulldown.hidePanel();
        this.searchValue = this.row[this.inputValue]?this.row[this.inputValue]:''
      },
      // 让搜索框获取焦点 ========= 暂无使用
      getFocus(){
        if (this.$refs.refInput1.disabled){
          return false
        }else {
          this.$refs.refInput1.focus()
          return true
        }
      },
      // 重写获取焦点
      focus(){
        this.$refs.refInput1.focus()
      },
      // 让输入框获取焦点后显示弹框，让表格获取焦点
      pulldownFocus(e){
        // 获取焦点全选
        if(e) e.$event.target.select()
        this.$refs.pulldown.showPanel()
        this.$nextTick(_ => {
          this.$refs.pulldownTable.focus()
        })
      },
      // 搜索框失去焦点，事件处理
      pulldownBlur(){
        let list = document.getElementsByClassName('vxe-table--tooltip-wrapper')
        if(list.length > 0){
          list.forEach(item => {
            let className = item.getAttribute("class")
            if( className.indexOf('is--visible') != -1 && className.indexOf('placement--top') != -1 ){
              item.remove('is--visible')
              item.remove('placement--top')
            }
          })
        }
        setTimeout(_ => {
          this.$nextTick(_ => {
            this.$refs.pulldown.hidePanel()
          })
        }, 100)
      }
    }
  };
</script>

<style>
  .xp-drop_down_filter .vxe-table--ignore-clear{
    transform: none !important;
    transition: none !important;
    animation: none !important;
    transform-style: flat !important;
  }

  .drop-down-filter-dropdown th{
    padding: 0px !important;
  }

  .drop-down-filter-dropdown .vxe-body--column{
    height: 24px !important;
  }
</style>
