const express = require('express');
const router = express.Router();
const service = require('../services/roleService');

// 列表
router.get('/role/list', service.list);

// 详情
router.get('/role/info', service.info);

// 新增
router.post('/role/add', service.add);

// 编辑
router.post('/role/edit', service.edit);

// 删除
router.post('/role/del', service.del);

module.exports = router;



