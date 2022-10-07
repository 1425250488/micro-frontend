const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/studentService');

// 列表
router.get('/student/list', service.list);

// 详情
router.get('/student/info', service.info);

// 新增
router.post('/student/add', service.add);

// 编辑
router.post('/student/edit', service.edit);

// 删除
router.post('/student/del', service.del);

module.exports = router;



