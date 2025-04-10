//导入数据库模块
const db = require('../db/index');
//导入加密模块
const bcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//config文件
const config = require('../config');

//注册用户的处理函数
reguser =  (req,res) => {
    const userData = req.body;
    //它准备执行一个数据库查询，该查询目的是在ev_users 表中查找于提供的用户名相匹配的记录
    const search = `select * from ev_users where username='${userData.username}';`;
    db.query(search,(err,results) => {
        //语句查询出错
        if (err) {
            return res.cc(err);
        }
        //用户名被占用
        if(results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！');
        }
        //调用bcrypt.hashSync()对密码进行加密
        userData.password = bcypt.hashSync(userData,password,10);
        //插入新用户
        //构造插入语句，使用set?可以往数据库直接插入一个对象
        const insert = `insert into ev_users set ?;`;
        db.query(
            insert,
            {username: userData.username,password: userData.password},
            (err,results) => {
                if (err) {
                    return res.cc(err);
                }
                //console.log(results);
                if (results.affectedRows !== 1){
                    return res.cc('注册用户失败，请稍后尝试！');
                }
                //注册用户成功
                //res.send({status: 1,message: '注册成功！'});
                res.cc('注册成功!',0);
            }
        );
    });
};

//登录处理函数
login = (req,res) => {
    const userData = req.body;
    const search = `select * from ev_users where username='${userData.username}';`;
    db.query(search,(err,results) => {
        //语句查询出错
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('登录失败');
        //判断密码是否正确
        const compareResult = bcrypt.compareSync(
            userData.password,
            results[0].password
        );
        if (!compareResult) return res.cc('登录失败');
        //搞token密码，用户头像这些信息要剔除（用户头像怕他太大了）
        const user = {...results[0],password: '',user_pic: '' };
        //生成token字符串
        const tokenStr = jwt.sign(user,config.jetSecretKey, {
            expiresIn: config.expiresIn,
        });
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer' + tokenStr,
        })
    })
}

//导出
module.exports = {
    login,
    reguser,
}