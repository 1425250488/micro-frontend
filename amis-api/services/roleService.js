const { querySql, queryOne, format } = require('../utils/index');
const boom = require('boom');
const { 
    CODE_ERROR,
    CODE_SUCCESS, 
    PRIVATE_KEY, 
    JWT_EXPIRED 
  } = require('../utils/constant');

function list(req, res, next) {
    let { page, size, role_name, status } = req.query;
    page = page || 1
    size = size || 15
    role_name = role_name || ''
    status = status || ''
    let query_1 = `select * from role where role_name like '%${role_name}%' and status like '%${status}%' order by create_time desc`
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
    let { role_id } = req.query;
    if( role_id ){
        let query = `select * from role where role_id = ${role_id}`
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
                    msg: `查询不到 role_id 为 ${role_id} 的用户`, 
                    data: null 
                })
            }
        })
    }else{
        res.json({ 
            code: CODE_ERROR, 
            msg: `role_id 未传`, 
            data: null 
        })
    }
}

function add(req, res, next) {
    let { role_name, rules, status, note } = req.body;
    status = status || 1
    note = note || ''
    if( !role_name || !rules ){
        res.json({ 
            code: CODE_ERROR, 
            msg: `role_name || rules= 未传`, 
            data: null 
        })
    }else{
        const query = `insert into role( role_name, rules, status, note ) values( '${role_name}', '${rules}', '${status}', '${note}' )`;
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
    }
}

function edit(req, res, next) {
    let { role_id, role_name, rules, status, note } = req.body;
    if( role_id ){
        let updateList = []
        if( role_name !== undefined ) updateList.push(`role_name='${role_name}'`)
        if( rules !== undefined ) updateList.push(`rules='${rules}'`)
        if( status !== undefined ) updateList.push(`status='${status}'`)
        if( note !== undefined ) updateList.push(`note='${note}'`)
        if( updateList.length > 0 ){
            const query = `update role set ${updateList.join(',')} where role_id='${role_id}'`;
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
            msg: `role_id 未传`, 
            data: null 
        })
    }
}

function del(req, res, next) {
    let { role_id } = req.body;
    if( role_id ){
        const query = `delete from role where role_id='${role_id}'`;
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
    }else{
        res.json({ 
            code: CODE_ERROR,
            msg: `role_id 未传`, 
            data: null 
        })
    }
}


module.exports = {
    list,
    info,
    add,
    edit,
    del
}