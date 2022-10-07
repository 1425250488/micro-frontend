import { registerRendererByType } from 'amis-widget/dist/index.umd.js';
import { registerAmisEditorPlugin } from 'amis-widget/dist/index.umd.js';
import main from './main'
registerRendererByType(main, {
  type: 'drop-down-filter',
  usage: 'formitem',
  weight: 100,
  framework: 'vue2'
});

class InfoCardPlugin {
  rendererName = 'drop-down-filter';
  $schema = '/schemas/UnkownSchema.json';
  name = '下拉筛选';
  description = '下拉筛选控件【drop-down-filter】';
  tags = ['表单项'];
  icon = 'fa fa-file-code-o';
  scaffold = { //默认值
    type: 'drop-down-filter',
    label: '下拉框',
    name: 'name', //字段名
    m_placement: 'button'
  };
  previewSchema = {
    type: 'drop-down-filter',
    label: '这是个可支持大数据的筛选组件',
  };

  panelTitle = '配置';

  panelControls = [
    {
      "name": "placement",
      "type": "radios",
      "label": "弹出方向",
      "value": "top",
      "options": [
        {
          "label": "上",
          "value": "top"
        },
        {
          "label": "下",
          "value": "button"
        }
      ]
    },
    {
      "name": "showHeader",
      "type": "radios",
      "label": "是否显示表头",
      "value": true,
      "options": [
        {
          "label": "是",
          "value": true
        },
        {
          "label": "否",
          "value": false
        }
      ]
    },
    {
      type: 'text',
      name: 'faSearch',
      label: '图标',
      value: 'fa fa-search'
    },
    {
      type: 'text',
      name: 'height',
      label: '筛选框高度',
      value: '300px'
    },
    {
      "name": "transfer",
      "type": "radios",
      "label": "是否将弹框容器插入于body",
      "value": true,
      "options": [
        {
          "label": "是",
          "value": true
        },
        {
          "label": "否",
          "value": false
        }
      ]
    }
  ];
}

registerAmisEditorPlugin(InfoCardPlugin, {
  rendererName: 'drop-down-filter',
  name: '下拉筛选',
  // description: '信息展示卡片',
  // tags: ['展示', '自定义'],
  order: 99,
  // icon: 'fa fa-file-code-o',
  // panelTitle: '配置',
  disabledRendererPlugin: false,
});
