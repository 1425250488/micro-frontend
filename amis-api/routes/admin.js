const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/adminService');

// 列表
router.get('/admin/list', service.list);

// 详情
router.get('/admin/info', service.info);

// 新增
router.post('/admin/add', service.add);

// 编辑
router.post('/admin/edit', service.edit);

// 删除
router.post('/admin/del', service.del);

module.exports = router;



