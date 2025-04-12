//这一步看黑马解析，看看怎么弄个数据库
//可以想想如何将MySQL转换成MongoDB
const mysql = require('mysql');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'qjr156116152.',
  port: 3306,
  database: 'bigEvent',
});

module.exports = db;