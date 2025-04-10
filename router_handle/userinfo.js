//导入数据库模块
const db = require('../db/index');
const bcrypt = require('bcryptjs');
//获取用户信息模块
const getUserInfo = (req,res) => {
    const getSql = 
    'select id,username,nickname,email,user_pic from ev_users where id=?;';
    //req上的user属性是解析token时express-jwt自动挂载上去的
    //express-jwt 7 以上的版本会挂载到req.auth而不是req.user
    db.query(getSql,req.auth.id,(err,results) => {
        if(err) return res.cc(err);
        if (results.length !==1) return res.cc('获取用户信息失败！');
        res.send({
            status: 0,
            Message: '获取用户信息成功！',
            data: results[0],
        });    
    });
};

//更新用户信息模块
const updateUserInfo = (req,res) => {
    const sql  = 'update ev_users set ? where id=?;';
    //[username, userId] 是一个数组，包含了用于替换SQL语句中占位符的值。
    db.query(sql,[req.body,req.body.id],(err,results) => {
        if(err) return res.cc('修改用户信息失败');
        if(results.affectedRows !==1) return res.cc('用户不存在！');//?
        res.cc('修改用户信息成功',0);
    });
};

//重置密码
const updatePassword = (req,res) => {
    const sql = `select * from ev_users where id=${req.auth.id}`;
    db.query(sql,(err,results) => {
        if(err) return res.cc(err);
        if(results.length!== 1) return res.cc('用户不存在！');
        //判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(
            req.body.oldPwd,
            results[0].password
        );
        if(!compareResult) return res.cc('旧密码错误！');
        //对新密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd,10);
        const sql = `update ev_users set password='${newPwd}' where id=${req.auth.id};`;
        db.query(sql,(err,results) => {
            if(err) return res.cc(err);
            if(results.affectedRows !== 1) return res.cc('更新密码失败！');
            res.cc('更新密码成功',0);
        });
    });
};

//更新用户头像
const updateAvatar = (req,res) => {
    const sql = `update ev_users set user_pic='${req.body.avatar}' where id=${req.auth.id};`;
    db.query(sql,(err,results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) return res.cc('更新头像失败！');
        res.cc('更新头像成功',0);
    });
};

module.exports = {
    getUserInfo,
  updateUserInfo,
  updatePassword,
  updateAvatar,
}
