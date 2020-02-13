const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const uuidv3 = require('uuid/v3');

const keys = require("../../config/keys");

const Study = require('../../models/Study');
const Course = require('../../models/Course');

router.get('/test', async ctx => {
    var a = ctx.query.a;
    console.log(a)
    ctx.status = 200
    ctx.body = {
        message: 'success'
    }
})

/**
 * @desc 视频观看开始时间
 * @access 接口私密
 */
router.post(
    '/setstarttime', 
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        const sid = uuidv3(String(Date.now()), keys.UID_NAMESPACE);
        const {uid, cid, } = ctx.request.body
        const newStudy = new Study({sid, uid, cid })
        await newStudy.save()
            .then(res => {
                ctx.status = 200
                ctx.body = {
                    message: 'success',
                    sid: res.sid,
                    uid: res.uid,
                    cid: res.cid,
                    starttime: res.starttime
                }
            })
            .catch(err => {
                ctx.status = 500
                ctx.body = {
                    message: 'err',
                    err
                }
            })
        }
)


/**
 * @desc 视频结束时间
 * @access 接口私密
 */
router.post(
    '/setendtime', 
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        const {sid} = ctx.request.body
        if(sid) {
            const endtime = Date.now()
            await Study.update({sid}, {endtime})
                .then(() => {
                    ctx.status = 200
                    ctx.body = {
                        message: 'success'
                    }
                })
                .catch(err => {
                    console.log(err)
                    ctx.status = 500
                    ctx.body = {
                        message: 'error'
                    }
                })
        } else {
            ctx.status = 404
            ctx.body = {
                message: 'not found'
            }
        }
    }
)


/**
 * @desc 获取已经学习的课程
 * @access 接口私密
 */
router.post(
    '/getlessons',
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        const {uid} = ctx.request.body
        const findResult = await Study.find({uid}, {cid: 1})
        const cidRepeat = findResult.map(x => x.cid)
        const cidList = [...new Set(cidRepeat)]
        const result = []
        for(let i in cidList) {
            let course =  await Course.find({cid: cidList[i]}, {cid: 1, name: 1, style: 1})
            result.push(course[0])
        }
        ctx.status = 200
        ctx.body = {
            message: 'Get lessons success',
            lessons: result
        }
    }
)


/**
 * @desc 获取学习记录
 * @access 接口私密 
 * @param [uid]
 * @return [uid, name, style, starttime, long]
 */
router.post(
    '/gethistory',
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        const {uid} = ctx.request.body
        const findResult = await Study.find({uid})
        const result = []
        for(let i in findResult) {
            const {cid, starttime, endtime} = findResult[i]
            const regx = /[a-zA-Z]/g
            const startStr = JSON.stringify(starttime)
            let start = startStr.split('.')[0].replace(regx, ' ')
            start = start.replace(/\"|\'/g, '')
            const long = parseInt((Number(endtime) - Number(starttime)) / 1000)
            const course = await Course.find({cid}, {cid: 1, name: 1, style: 1})
            const {name, style} = course[0]
            result.push({cid, name, style, start, long})
        }
        ctx.status = 200
        ctx.body = {
            message: 'Get history success',
            history: result
        }
        
    }
)



module.exports = router.routes();