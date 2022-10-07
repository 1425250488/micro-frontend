const { querySql, queryOne, format } = require('../utils/index');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const md5 = require('../utils/md5');
const { 
    CODE_ERROR,
    CODE_SUCCESS, 
    PRIVATE_KEY, 
    JWT_EXPIRED 
  } = require('../utils/constant');

function list(req, res, next) {
    let { page, size, name, phone, account, is_admin, status } = req.query;
    page = page || 1
    size = size || 15
    name = name || ''
    phone = phone || ''
    account = account || ''
    is_admin = is_admin || ''
    status = status || ''
    let query_1 = `select * from admin where status like '%${status}%' and name like '%${name}%' and phone like '%${phone}%' and account like '%${account}%' and is_admin like '%${is_admin}%' order by create_time desc`
    querySql(query_1).then(result_1 => {
        let query_2 = query_1 + ` limit ${(page - 1) * size}, ${size}`
        querySql(query_2).then(result_2 => {
            res.json({ 
                code: CODE_SUCCESS, 
                msg: '查询数据成功', 
                data: {
                    list: result_2,
                    total: result_1.length
                } 
            })
        }) 
    })
}

function info(req, res, next) {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     return res.status(CODE_ERROR).json({ code: CODE_ERROR, errors: errors.array()[0].msg, data: null })
    // }
    let { admin_id } = req.query;
    if( admin_id ){
        let query = `select * from admin where admin_id = ${admin_id}`
        querySql( query ).then(result => {
            if( result.length > 0 ){
                res.json({ 
                    code: CODE_SUCCESS, 
                    msg: '查询数据成功', 
                    data: result[0]
                })
            }else{
                res.json({ 
                    code: CODE_ERROR, 
                    msg: `查询不到 admin_id 为 ${admin_id} 的用户`, 
                    data: null 
                })
            }
        })
    }else{
        res.json({ 
            code: CODE_ERROR, 
            msg: `admin_id 未传`, 
            data: null 
        })
    }
}

function add(req, res, next) {
    let { name, phone, account, password, roles, status } = req.body;
    phone = phone || ''
    roles = roles || ''
    if( !name || !account || !password ){
        res.json({ 
            code: CODE_ERROR, 
            msg: `name || account || password 未传`, 
            data: null 
        })
    }else{
        findUser(account, name).then(data => {
            if (!data) {
                password = md5(password);
                const query = `insert into admin( name, phone, account, password, roles, status ) values( '${name}', '${phone}', '${account}', '${password}', '${roles}', '${status}' )`;
                querySql(query).then(result => {
                    if (!result || result.length === 0) {
                        res.json({ 
                            code: CODE_ERROR, 
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
            }else{
                res.json({ 
                    code: CODE_ERROR, 
                    msg: '用户已存在', 
                    data: null 
                }) 
            }
        })
    }
}

function edit(req, res, next) {
    let { admin_id, name, phone, account, password, roles, status } = req.body;
    if( admin_id ){
        let updateList = []
        if( name !== undefined ) updateList.push(`name='${name}'`)
        if( phone !== undefined ) updateList.push(`phone='${phone}'`)
        if( account !== undefined ) updateList.push(`account='${account}'`)
        if( password !== undefined ) updateList.push(`password='${md5(password)}'`)
        if( roles !== undefined ) updateList.push(`roles='${roles}'`)
        if( status !== undefined ) updateList.push(`status='${status}'`)
        if( updateList.length > 0 ){
            const query = `update admin set ${updateList.join(',')} where admin_id='${admin_id}'`;
            querySql(query).then(result => {
                res.json({ 
                    code: CODE_SUCCESS, 
                    msg: '成功', 
                    data: null 
                })
            })
        }else{
            res.json({ 
                code: CODE_ERROR, 
                msg: `未传修改值`, 
                data: null 
            })
        }
    }else{
        res.json({ 
            code: CODE_ERROR, 
            msg: `admin_id 未传`, 
            data: null 
        })
    }
}

function del(req, res, next) {
    let { admin_id, status } = req.body;
    if( admin_id ){
        const query = `delete from admin where admin_id='${admin_id}'`;
        querySql(query).then(data => {
            console.log( 'data ===>>>', data )
            if ( data.affectedRows === 0 ) {
                res.json({ 
                  code: CODE_ERROR, 
                  msg: '更新0条', 
                  data: null 
                })
            } else {
                res.json({ 
                  code: CODE_SUCCESS, 
                  msg: '成功', 
                  data: null 
                })
            }
        })

        // const query = `update admin set status='${status || 2}' where admin_id='${admin_id}'`;
        // querySql(query).then(data => {
        //     console.log( 'data ===>>>', data.changedRows )
        //     if ( data.changedRows === 0 ) {
        //         res.json({ 
        //           code: CODE_ERROR, 
        //           msg: '更新0条', 
        //           data: null 
        //         })
        //       } else {
        //         res.json({ 
        //           code: CODE_SUCCESS, 
        //           msg: '成功', 
        //           data: null 
        //         })
        //       }
        // })
    }else{
        res.json({ 
            code: CODE_ERROR, 
            msg: `admin_id 未传`, 
            data: null 
        })
    }
}


// 通过用户名查询用户信息
function findUser(account, name) {
    const query = `select admin_id, account from admin where account='${account}' or name='${name}'`;
    return queryOne(query);
}



module.exports = {
    list,
    info,
    add,
    edit,
    del
}