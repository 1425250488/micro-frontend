import { registerRendererByType } from 'amis-widget/dist/index.umd.js';
import { registerAmisEditorPlugin } from 'amis-widget/dist/index.umd.js';
import main from './main'
registerRendererByType(main, {
  type: 'simple-input',
  usage: 'formitem',
  weight: 100,
  framework: 'vue2'
});
