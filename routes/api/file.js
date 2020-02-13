const Router = require("koa-router");
const router = new Router();

// const getUrlParams = require('../../utils/getUrlParams')
const Course = require('../../models/Course');

// const fs=require('fs');
// const path = require('path');

router.get('/test', async (ctx) => {
    ctx.status = 200;
    ctx.body = { msg: '这是test' };
})


/**
 * @desc 视频上传
 * @access 接口私密
 */
router.post('/upload', async (ctx, next) => {
// 上传单个文件
    const file = ctx.request.files.file;
    const pathSplit = file.path.split('\\');
    const url = `/upload/${pathSplit[pathSplit.length - 1]}`;
    const { cid, branchTitle } = ctx.request.body;
    const contentItem = { title: branchTitle, url}
    const findResult = await Course.find({cid});
    if(findResult && findResult.length > 0) {
        // 添加
        const content = findResult[0].content
        content.push(contentItem)
        await Course.update({cid}, {content})
            .then(() => {
                console.log('新增成功');
                ctx.status = 200;
                ctx.body = { cid, content };
            })
            .catch(err => {
                console.log('新增错误');
                ctx.body = err;
            })

    } else {
        // 新建
        const newCourse = new Course({ cid, content: contentItem, });

        // 存储到数据库
        await newCourse.save().then(res => {
            console.log('上传成功');
            ctx.status = 200;
            ctx.body = res;
        }).catch(err => {
            console.log('上传失败');
            ctx.body = err;
        })
    }
});



/**
 * @desc 视频上传
 * @access 接口私密
 */
router.post('/uploadmaininfo', async (ctx, next) => {
    const file = await ctx.request.files.file;
    const pathSplit = file.path.split('\\');
    const url = `/upload/${pathSplit[pathSplit.length - 1]}`;
    const { cid, tid, name, style, desc } = ctx.request.body
    const findResult = await Course.find({cid});
    if(findResult && findResult.length > 0) {
        await Course.update({cid}, {
            name,
            style,
            tid,
            desc,
            image: url,
            usable: true
        }).then(res => {
            ctx.status = 200;
            ctx.body = {
                'message': 'success',
                'result': res
            }
        }).catch(err => {
            ctx.status = 500;
            ctx.body = {
                'message': err,
            }
        })
    } else {
        // 查询不到cid
        ctx.status = 404;
        ctx.body = {
            'message': '找不到资源',
        }
    }
})

/**
 * @desc 根据课程类型获取课程主要信息
 * @access 接口公开
 */
router.post('/getmaincoursebystyle', async ctx => {
    const {style} = ctx.request.body
    const findResult = await Course.find(
        {style, usable: true},
        {cid: 1, name: 1, style: 1, desc: 1, image: 1})
    ctx.status = 200
    ctx.body = {
        message: 'success',
        findResult
    }
})


/**
 * @desc 根据cid获取课程所有信息
 * @access 接口私密
 */
router.post('/getcoursebycid', async ctx => {
    const {cid} = ctx.request.body
    console.log(cid)
    const findResult = await Course.find({cid, usable: true})
    if(findResult && findResult.length > 0) {
        ctx.status = 200
        ctx.body = {
            message: 'success',
            result: findResult[0]
        }
    } else {
        ctx.status = 404
        ctx.body = {
            message: 'Not Found',
        }
    }
})


/**
 * @desc 模糊搜索
 * @access 接口公开
 */
router.get('/search', async ctx => {
    const {keyword} = ctx.query
    console.log(keyword)
    const reg = new RegExp(keyword, 'i')
    const findResult = await Course.find(
        {
            $or: [
                {name: {$regex : reg}},
                {desc: {$regex : reg}},
                {style: {$regex : reg}},
            ]
        },
        {cid: 1, name: 1, style: 1, desc: 1, image: 1}
    )
    if(findResult.length > 0) {
        ctx.status = 200
        ctx.body = {
            message: 'Search course success',
            findResult
        } 
    } else {
        ctx.status = 404
        ctx.body = {
            message: 'Not Found',
            findResult
        }
    }
    
})





module.exports = router.routes();