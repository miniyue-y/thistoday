const koa = require('koa');

const app = new koa();

const static = require('koa-static');

const path = require('path');

const bodyparser = require('koa-bodyparser');

const router = require('koa-router')();

const query = require('./db/query.js')

app.use(static(path.join(process.cwd(),'public')));

app.use(bodyparser());

app.use(router.routes());

app.use(router.allowedMethods());

router.get('/api/list',async ctx=>{
    let data = await query('select * from listt');
    if(data.msg === 'error'){
        ctx.body = {
            code:0,
            msg:error
        }
    } else {
        ctx.body = {
            code:1,
            data
        }
    }
})

router.post('/api/add',async ctx=>{
    let {username,password,idcard,address,number} = ctx.request.body
    if(username && password && number){
        let listdata = await query('select * from listt where number=?',{number})
        if(listdata.data.length){
            ctx.body = {
                code:3,
                msg:'已经存在了哦'
            }
        } else {
            try{
                await query('insert into listt (username,password,idcard,address,number) values (?,?,?,?,?)',[username,password,idcard,address,number])
                ctx.body ={
                    code:1,
                    msg:'添加成功'
                }
            } catch(e){
                ctx.body = {
                    code:0,
                    msg:eerror
                }
            }
        }
    } else{
        ctx.body = {
            code:2,
            msg:'参数缺失哦'
        }
    }
})

router.get('/api/del',async ctx=>{
    let {id} = ctx.query;
    if(id || id === 0){
        try{
            await query('delete from listt where id=?',[id]);
            ctx.body = {
                code:1,
                msg:'删除成功'
            }
        } catch(e){
            ctx.body = {
                code:0,
                msg:e.error
            }
        }
    } else{
        ctx.body = {
            code:2,
            msg:'参数缺失哦'
        }
    }
})

router.post('/api/edit',async ctx => {
    let {username,password,address,idcard,number,id} = ctx.request.body;
    if(username && password && idCard && id){
        try{
            await query('update listt set username=?,password=?,address=?,number=?,idcard=? where id=?',[username,password,address,idcard,number,id])
            ctx.body = {
                code:1,
                msg:'修改成功'
            }
        }catch(e){
            ctx.body = {
                code:0,
                msg:e.error
            }
        }
    }else{
        ctx.body = {
            code:2,
            mgs:'丢失参数'
        }
    }
})

app.listen(process.env.PORT || 3000,()=>{
    console.log('服务启动成功')
})