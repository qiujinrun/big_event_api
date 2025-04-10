const express = require('express');
//从node.modules导入@escook/express-joi
const expressJoi = require('@escook/express-joi');
const { reg_login_schema } = require('../schema/user');
const { reguser,login } = require('../router_handle/user');
//创建路由对象
const router = express.Router();

//注册新用户，如果验证通过，则处理reguser
router.post('/reguser',expressJoi(reg_login_schema),reguser)
//登录，如果验证通过，则处理login
router.post('/login',expressJoi(reg_login_schema),login);

//导出，将路由共享出去
module.exports = router;
