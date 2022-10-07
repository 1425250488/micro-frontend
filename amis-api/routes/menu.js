const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/menuService');

// 列表
router.get('/menu/list', service.list);

// 详情
router.get('/menu/info', service.info);

// 新增
router.post('/menu/add', service.add);

// 编辑
router.post('/menu/edit', service.edit);

// 删除
router.post('/menu/del', service.del);

module.exports = router;



