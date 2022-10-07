const { querySql, queryOne, format } = require('../utils/index');
const { 
    CODE_ERROR,
    CODE_SUCCESS, 
    PRIVATE_KEY, 
    JWT_EXPIRED 
  } = require('../utils/constant');

function list(req, res, next) {
    let query_1 = `select menu_id,pid,path,icon,menu_name,router_url,router_auth,router_cache,router_name,sort,is_show,note,create_time,preset from menu order by sort asc`
    querySql(query_1).then(result_1 => {
        res.json({ 
            code: CODE_SUCCESS, 
            msg: '查询数据成功', 
            data: result_1 || []
        })
    })
}

function info(req, res, next) {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     return res.status(CODE_ERROR).json({ code: CODE_ERROR, errors: errors.array()[0].msg, data: null })
    // }
    let { menu_id, path } = req.query;
    if( menu_id ){
        let query = `select * from menu where menu_id = ${menu_id}`
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
                    msg: `查询不到 menu_id 为 ${menu_id} 的菜单`, 
                    data: null 
                })
            }
        })
    }else if( path ){
        let query = `select * from menu where path = '${path}'`
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
                    msg: `查询不到 menu_id 为 ${menu_id} 的菜单`, 
                    data: null 
                })
            }
        })
    }else{
        res.json({ 
            code: CODE_ERROR, 
            msg: `menu_id 或 path 未传`, 
            data: null 
        })
    }
}

function add(req, res, next) {
    let { pid, path, icon, menu_name, router_url, router_auth, router_cache, router_name, sort, is_show, note, json } = req.body;
    pid = pid || ''
    path = path || ''
    icon = icon || ''
    menu_name = menu_name || ''
    router_url = router_url || ''
    router_auth = router_auth || 1
    router_cache = router_cache || 1
    router_name = router_name || ''
    sort = sort || 0
    is_show = is_show || 1
    note = note || ''
    json = json || ''
    console.log( 'router_cache', router_cache )
    if( !path || !menu_name ){
        res.json({ 
            code: CODE_ERROR, 
            msg: `path || menu_name 未传`, 
            data: null 
        })
    }else{
        const query = `insert into menu( pid, path, icon, menu_name, router_url, router_auth, router_cache, router_name, sort, is_show, note, json ) values( '${pid}', '${path}', '${icon}', '${menu_name}', '${router_url}', '${router_auth}', '${router_cache}', '${router_name}', '${sort}', '${is_show}', '${note}', '${json}' )`;
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
    let { menu_id, pid, path, icon, menu_name, router_url, router_auth, router_cache, router_name, sort, is_show, note, json } = req.body;
    if( menu_id ){
        let updateList = []
        if( pid !== undefined ) updateList.push(`pid='${pid}'`)
        if( path !== undefined ) updateList.push(`path='${path}'`)
        if( icon !== undefined ) updateList.push(`icon='${icon}'`)
        if( menu_name !== undefined ) updateList.push(`menu_name='${menu_name}'`)
        if( router_url !== undefined ) updateList.push(`router_url='${router_url}'`)
        if( router_auth !== undefined ) updateList.push(`router_auth='${router_auth}'`)
        if( router_cache !== undefined ) updateList.push(`router_cache='${router_cache}'`)
        if( router_name !== undefined ) updateList.push(`router_name='${router_name}'`)
        if( sort !== undefined ) updateList.push(`sort='${sort}'`)
        if( is_show !== undefined ) updateList.push(`is_show='${is_show}'`)
        if( note !== undefined ) updateList.push(`note='${note}'`)
        if( json !== undefined ) updateList.push(`json='${json}'`)
        console.log( JSON.stringify( json ) )
        if( updateList.length > 0 ){
            const query = `update menu set ${updateList.join(',')} where menu_id='${menu_id}'`;
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
            msg: `menu_id 未传`, 
            data: null 
        })
    }
}

function del(req, res, next) {
    let { menu_ids } = req.body;
    if( menu_ids ){
        const query = `delete from menu where menu_id in (${menu_ids})`;
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
            msg: `menu_ids 未传`, 
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