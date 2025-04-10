//导入express 
const express = require('express');
//创建服务器的实例对象
const app = express()
//导入并使用cors中间件
const cors = require('cors');
app.use(cors());

//导入Joi来定义验证规则
const Joi = require('joi');

//导入解析token的中间件
const { expressjwt} = require('express-jwt');
const config = require('./config');

//配置解析表单数据的中间件，这个只解析 application/x-www-form-urlencoded  格式的表单数据
app.use(express.urlencoded({extended:false}))

//挂载res.cc()中间件
app.use((req,res,next) => {
    //status=0成功，status=1失败,默认为1方便处理失败的情况
    res.cc = function (err,status = 1) {
        res.send({
            status,
            //状态描述，判断err是错误对象还是字符串
            message: err instanceof Error ? err.message : err,
        });
    };
    next();
});
//解析token
app.use(
    expressjwt({ secret: config.jetSecretKey,//用来校验Token得密匙，需要和签发是用的一样
        algorithms: ['HS256']//指定使用的加密算法
    }).unless({
        path: [/^\/api\//],//指定哪些接口不需要验证token
    })
);
//托管静态资源文件
// app.use('/uploads',express.static('./uploads'));

//导入并注册路由模块
const userRouter = require('./router/user');
//添加前缀
app.use('/api',userRouter);

const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);

const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter);

const articleRouter = require('./router/article');
app.use('/my/article', articleRouter);




//错误级别的中间件
app.use(function (err,req,res,next) {
    //4.1 Joi 参数检验失败
    if (err instanceof Joi.ValidationError) {
        return res.cc(err);
    }
    //捕获身份验证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份验证失败');
    // 4.2未知错误
    res.cc(err)
})

//启动服务器
app.listen(3007,function(){
    console.log('api server running at http://127.0.0.1:3007');
})

