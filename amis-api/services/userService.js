const { querySql, queryOne, format } = require('../utils/index');
const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const { 
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY, 
  JWT_EXPIRED 
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');


// 登录
function login(req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg));
  } else {
    let { account, password } = req.body;
    // console.log('用户名密码', req.body)
    // md5加密
    password = md5(password);
    // console.log( '加密密码', password )
    const query = `select * from admin where account='${account}' and password='${password}'`;
    querySql(query).then(user => {
      if (!user || user.length === 0) {
        res.json({ 
        	code: CODE_ERROR, 
        	msg: '用户名或密码错误', 
        	data: null 
        })
      } else {
        if( user[0].status == 2 ){
          res.json({ 
            code: CODE_ERROR, 
            msg: '当前用户被禁用登录', 
            data: null 
          })
        }
        //记录登录
        let last_ip = req.rawHeaders.find(item => item.indexOf(':') !== -1 ) || 0
        let login_count = user[0].login_count + 1
        let last_time = format( new Date(), "yyyy-MM-dd hh:mm:ss");
        querySql(`update admin set last_ip='${last_ip}', login_count='${login_count}', last_time='${last_time}' where admin_id='${user[0].admin_id}'`)
        let userData = {
          admin_id: user[0].admin_id,
          account: user[0].account,
          name: user[0].name,
          phone: user[0].phone
        };
        // 登录成功，签发一个token并返回给前端
        const token = jwt.sign(
          // payload：签发的 token 里面要包含的一些数据。
          userData,
          // 私钥
          PRIVATE_KEY,
          // 设置过期时间
          { expiresIn: JWT_EXPIRED }
        )
        getMenu(user[0].admin_id).then(arr=>{
          res.json({ 
            code: CODE_SUCCESS, 
            msg: arr.msg || '登录成功', 
            data: {
              token: token,
              admin: arr.admin,
              menu: arr.menu
            }
          })
        })
        // res.json({ 
        // 	code: CODE_SUCCESS, 
        // 	msg: '登录成功', 
        // 	data: { 
        //     token,
        //     userData
        //   } 
        // })
      }
    })
  }
}


// 注册
function register(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { name, phone, account, password } = req.body;
    findUser(account, name)
  	.then(data => {
  		if (data) {
  			res.json({ 
	      	code: CODE_ERROR, 
	      	msg: '用户已存在', 
	      	data: null 
	      })
  		} else {
	    	password = md5(password);
        let last_ip = req.rawHeaders.find(item => item.indexOf(':') !== -1 ) || 0
        let login_count = 1
        let last_time = format( new Date(), "yyyy-MM-dd hh:mm:ss");
  			const query = `insert into admin(account, password, name, phone, last_ip, login_count, last_time ) values('${account}', '${password}', '${name}', '${phone}', '${last_ip}', '${login_count}', '${last_time}')`;
  			querySql(query).then(result => {
		    	// console.log('用户注册===', result);
		      if (!result || result.length === 0) {
		        res.json({ 
		        	code: CODE_ERROR, 
		        	msg: '注册失败', 
		        	data: null 
		        })
		      } else {
            const queryUser = `select * from admin where account='${account}' and password='${password}'`;
            querySql(queryUser).then(user => {
              //记录登录
              let last_ip = req.rawHeaders.find(item => item.indexOf(':') !== -1 ) || 0
              let login_count = user[0].login_count + 1
              let last_time = format( new Date(), "yyyy-MM-dd hh:mm:ss");
              querySql(`update admin set last_ip='${last_ip}', login_count='${login_count}', last_time='${last_time}' where admin_id='${user[0].admin_id}'`)
              let userData = {
                admin_id: user[0].admin_id,
                account: user[0].account,
                name: user[0].name,
                phone: user[0].phone
              };
              // 登录成功，签发一个token并返回给前端
              const token = jwt.sign(
                // payload：签发的 token 里面要包含的一些数据。
                userData,
                // 私钥
                PRIVATE_KEY,
                // 设置过期时间
                { expiresIn: JWT_EXPIRED }
              )
              res.json({ 
                code: CODE_SUCCESS, 
                msg: '注册成功', 
                data: { 
                  token,
                  userData
                } 
              })
            })
		      }
		    })
  		}
  	})
   
  }
}

// 重置密码
function resetPwd(req, res, next) {
	const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { account, oldPassword, newPassword } = req.body;
    oldPassword = md5(oldPassword);
    validateUser(account, oldPassword)
    .then(data => {
      console.log('校验用户名和密码===', data);
      if (data) {
        if (newPassword) {
          newPassword = md5(newPassword);
				  const query = `update admin set password='${newPassword}' where account='${account}'`;
				  querySql(query)
          .then(user => {
            // console.log('密码重置===', user);
            if (!user || user.length === 0) {
              res.json({ 
                code: CODE_ERROR, 
                msg: '重置密码失败', 
                data: null 
              })
            } else {
              res.json({ 
                code: CODE_SUCCESS, 
                msg: '重置密码成功', 
                data: null
              })
            }
          })
        } else {
          res.json({ 
            code: CODE_ERROR, 
            msg: '新密码不能为空', 
            data: null 
          })
        }
      } else {
        res.json({ 
          code: CODE_ERROR, 
          msg: '用户名或旧密码错误', 
          data: null 
        })
      }
    })
   
  }
}

// 初始化获取权限
function info(req, res, next) {
  let { admin_id } = decode(req)
  getMenu(admin_id).then(arr=>{
    res.json({ 
      code: CODE_SUCCESS, 
      msg: arr.msg || '成功', 
      data: {
        admin: arr.admin,
        menu: arr.menu
      }
    })
  })
}

// 获取通过 roles 获取菜单
function getMenu(admin_id){
  return new Promise((resolve, reject) => {
    const query = `select * from admin where admin_id=${admin_id}`;
    querySql(query).then(result => {
      if( result.length > 0 ){
        let resObj = result[0]
        if( resObj.is_admin == 2 ){
          const query1 = `select menu_id,pid,path,icon,menu_name,router_url,router_auth,router_cache,router_name from menu order by sort asc`;
          querySql(query1).then(result1 => {
            resolve({ menu: result1, admin: resObj, msg: '' })
          })
        }else{
          if( resObj.roles ){
            const query1 = `select rules from role where role_id in (${ resObj.roles.split(',').map(item => item + "").join(',') })`
            querySql(query1).then(result1 => {
              if( result1 && result1.length > 0 ){
                let rule_list = [...new Set( [].concat( ...result1.map(item => item.rules.split(',').filter(item => item !== '')) ) )]
                const query2 = `select menu_id,pid,path,icon,menu_name,router_url,router_auth,router_cache,router_name,pid from menu where menu_id in (${ rule_list.join(',') }) order by sort desc`;
                querySql(query2).then(result2 => {
                  if( result2 && result2.length > 0 ){
                    resolve({ menu: result2, admin: resObj, msg: '' })
                  }else{
                    resolve({ menu: [], admin: {}, msg: `menu表中未查询到${rule_list.join(',')}` })
                  }
                })
              }else{
                resolve({ menu: [], admin: {}, msg: 'role表中未查询到rules' })
              }
            })
          }else{
            resolve({ menu: [], admin: {}, msg: 'admin表中未查询到roles' })
          }
        }
      }else{
        resolve({ menu: [], admin: {}, msg: 'admin_id未查到数据' })
      }
    })
  })
}

// 校验用户名和密码
function validateUser(account, oldPassword) {
	const query = `select admin_id, account from admin where account='${account}' and password='${oldPassword}'`;
  	return queryOne(query);
}

// 通过用户名查询用户信息
function findUser(account, name) {
  const query = `select admin_id, account from admin where account='${account}' or name='${name}'`;
  return queryOne(query);
}

function amisSave(req, res, next) {
  let { path, json } = req.body;
  const query = `select * from menu_bak where path='${path}'`;
  querySql( query ).then(result => {
    if( result.length > 0 ){
      const query1 = `update menu_bak set json='${json}' where path='${path}'`;
      querySql(query1).then(result1 => {
        if (!result || result1.length === 0) {
            res.json({ 
                code: CODE_SUCCESS,
                msg: '添加失败', 
                data: null 
            })
        }else{
            res.json({ 
                code: CODE_SUCCESS,
                msg: '成功', 
                data: null 
            })
        }
      })
    }else {
      const query1 = `insert into menu_bak( path, json ) values( '${path}', '${json}')`
      querySql(query1).then(result1 => {
        if (!result || result1.length === 0) {
            res.json({ 
                code: CODE_SUCCESS,
                msg: '添加失败', 
                data: null 
            })
        }else{
            res.json({ 
                code: CODE_SUCCESS,
                msg: '成功', 
                data: null 
            })
        }
      })
    }
  })
}


function amisInfo(req, res, next) {
  let { path } = req.body;
  const query = `select * from menu_bak where path='${path}'`;
  querySql( query ).then(result => {
    if( result.length > 0 ){
      res.json({ 
          code: CODE_SUCCESS, 
          msg: '查询数据成功', 
          data: result[0]
      })
  }else{
      res.json({ 
          code: CODE_SUCCESS, 
          msg: '查询数据成功', 
          data: {
            path: path,
            json: null
          }
      })
  }
  })
}


module.exports = {
  login,
  register,
  resetPwd,
  info,
  amisSave,
  amisInfo
}
