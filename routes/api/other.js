const Router = require("koa-router");
const router = new Router();
const uuidv3 = require('uuid/v3');

const keys = require("../../config/keys");
const dropUselessCourse = require("../../utils/dropUselessCourse")

router.get("/newid", async (ctx) => {
    const uid = uuidv3(String(Date.now()), keys.UID_NAMESPACE);
    ctx.status = 200;
    ctx.body = { 
        message: "success",
        id: uid
    }
});


/**
 *删除数据库无用课程
 */
router.get("/delete", async (ctx) => {
    result = await dropUselessCourse()
    ctx.status = 200
    ctx.body = {
        message: 'success',
        result
    }
})



module.exports = router.routes();