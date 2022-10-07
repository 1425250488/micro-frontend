const { querySql, queryOne, format } = require('../utils/index');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const md5 = require('../utils/md5');
const { 
    CODE_ERROR,
    CODE_SUCCESS, 
    PRIVATE_KEY, 
    JWT_EXPIRED,
    STATUS_ERROR,
    STATUS_SUCCESS
  } = require('../utils/constant');

function list(req, res, next) {
    let { page, perPage, name, phone, sex } = req.query;
    page = page || 1
    size = perPage || 15
    name = name || ''
    phone = phone || ''
    sex = sex || ''
    // let query_1 = `select * from admin where status like '%${status}%' and name like '%${name}%' and phone like '%${phone}%' and account like '%${account}%' and is_admin like '%${is_admin}%' order by create_time desc`
    let query_1 = `select * from student where name like '%${name}%' and phone like '%${phone}%' and sex like '%${sex}%' order by create_time desc`
    querySql(query_1).then(result_1 => {
        let query_2 = query_1 + ` limit ${(page - 1) * size}, ${size}`
        querySql(query_2).then(result_2 => {
            res.json({ 
                status: STATUS_SUCCESS, 
                msg: '查询数据成功', 
                data: {
                    rows: result_2,
                    count: result_1.length
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
    let { id } = req.query;
    if( id ){
        let query = `select * from student where id = ${id}`
        querySql( query ).then(result => {
            if( result.length > 0 ){
                res.json({ 
                    status: STATUS_SUCCESS, 
                    msg: '查询数据成功', 
                    data: result[0]
                })
            }else{
                res.json({ 
                    status: STATUS_ERROR, 
                    msg: `查询不到 id 为 ${id} 的用户`, 
                    data: null 
                })
            }
        })
    }else{
        res.json({ 
            status: STATUS_ERROR, 
            msg: `id 未传`, 
            data: null 
        })
    }
}

function add(req, res, next) {
    let { name, sex, phone, birthday, id_card, address, guardian_name, guardian_phone } = req.body;
    sex = sex || 0
    phone = phone || ''
    birthday = birthday || ''
    id_card = id_card || ''
    address = address || ''
    guardian_name = guardian_name || ''
    guardian_phone = guardian_phone || ''
    if( !name ){
        res.json({ 
            status: STATUS_ERROR,
            msg: `name 未传`, 
            data: null 
        })
    }else{
        const query = `insert into student( name, sex, phone, birthday, id_card, address, guardian_name, guardian_phone ) values( '${name}', '${sex}', '${phone}', '${birthday}', '${id_card}', '${address}', '${guardian_name}', '${guardian_phone}' )`;
        querySql(query).then(result => {
            if (!result || result.length === 0) {
                res.json({ 
                    status: STATUS_ERROR,
                    msg: '添加失败', 
                    data: null 
                })
            }else{
                res.json({ 
                    status: STATUS_SUCCESS,
                    msg: '成功', 
                    data: null 
                })
            }
        })
    }
}

function edit(req, res, next) {
    // name, sex, phone, birthday, id_card, address, guardian_name, guardian_phone
    let { id, name, sex, phone, birthday, id_card, address, guardian_name, guardian_phone } = req.body;
    if( id ){
        let updateList = []
        if( name !== undefined ) updateList.push(`name='${name}'`)
        if( sex !== undefined ) updateList.push(`sex='${sex}'`)
        if( phone !== undefined ) updateList.push(`phone='${phone}'`)
        if( birthday !== undefined ) updateList.push(`birthday='${birthday}'`)
        if( id_card !== undefined ) updateList.push(`id_card='${id_card}'`)
        if( address !== undefined ) updateList.push(`address='${address}'`)
        if( guardian_name !== undefined ) updateList.push(`guardian_name='${guardian_name}'`)
        if( guardian_phone !== undefined ) updateList.push(`guardian_phone='${guardian_phone}'`)

        if( updateList.length > 0 ){
            const query = `update student set ${updateList.join(',')} where id='${id}'`;
            querySql(query).then(result => {
                res.json({ 
                    status: STATUS_SUCCESS,
                    msg: '成功', 
                    data: null 
                })
            })
        }else{
            res.json({ 
                status: STATUS_ERROR,
                msg: `未传修改值`, 
                data: null 
            })
        }
    }else{
        res.json({ 
            status: STATUS_ERROR,
            msg: `id 未传`, 
            data: null 
        })
    }
}

function del(req, res, next) {
    let { ids, status } = req.body;
    if( ids ){
        const query = `delete from student where id in (${ids})`;
        querySql(query).then(data => {
            console.log( 'data ===>>>', data )
            if ( data.affectedRows === 0 ) {
                res.json({ 
                  status: STATUS_ERROR,
                  msg: '更新0条', 
                  data: null 
                })
            } else {
                res.json({ 
                  status: STATUS_SUCCESS,
                  msg: '成功', 
                  data: null 
                })
            }
        })
    }else{
        res.json({ 
            code: CODE_ERROR, 
            msg: `ids 未传`, 
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