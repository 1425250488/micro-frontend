/**
 * 描述: 数据库基础配置
 * 作者: Jack Chen
 * 日期: 2020-06-12
*/

// const mysql = {
//     host: 'localhost', // 主机名称，一般是本机
// 	port: '3306', // 数据库的端口号，如果不设置，默认是3306
// 	user: 'root', // 创建数据库时设置用户名
// 	password: 'root', // 创建数据库时设置的密码
// 	database: 'amis',  // 创建的数据库
// 	connectTimeout: 5000 // 连接超时
// }

const mysql = {
    host: '175.178.87.254', // 主机名称，一般是本机
	port: '3306', // 数据库的端口号，如果不设置，默认是3306
	user: 'amis', // 创建数据库时设置用户名
	password: 'mcx4Pced5afJ3P2A', // 创建数据库时设置的密码
	database: 'amis',  // 创建的数据库
	connectTimeout: 5000 // 连接超时
}
module.exports = mysql;