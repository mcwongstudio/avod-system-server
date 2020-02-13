const Router = require("koa-router");
const router = new Router();
const gravatar = require('gravatar');
const jwt = require("jsonwebtoken");
const passport = require("koa-passport");
const uuidv3 = require('uuid/v3');

const encrypt = require("../../utils/bcrypt").encrypt;
const decrypt = require("../../utils/bcrypt").decrypt;
const User = require('../../models/User');
const keys = require("../../config/keys");

// test
router.get('/test', async (ctx) => {
    ctx.status = 200;
    ctx.body = { msg: '这是test' };
})

router.post('/register2', async ctx => {
    ctx.body = {msg: '666'};
    console.log(ctx.request.body)
    })

/**
 * @router POST api/users/register
 * @desc  注册接口地址
 * @access  接口公开
 */
router.post('/register', async ctx => {
    // 存储数据库
    const findResult = await User.find({sno: ctx.request.body.sno});
    if(findResult.length > 0) {
        ctx.status = 500;
        ctx.body = {msg: '学号已注册'};

    } else {
        try {
            const {username, email, sno, major, password, admin} = ctx.request.body;
            const admin_ = admin === 'true' ? true : false
            const uid = uuidv3(sno+Date.now(), keys.UID_NAMESPACE);
            const avatar = gravatar.url(email, {s: '200', r: 'pg', d: 'mm'});
        
            const newUser = new User({
                uid,
                email,
                sno,
                username,
                major,
                avatar,
                password: encrypt(password),
                admin: admin_
            });
    
            // 储存到数据库
            await newUser.save().then(user => {
                console.log('注册成功')
                ctx.body = user;
            }).catch( err => {
                console.log(err);
            });
            ctx.body = newUser;
        }
        catch(err) {
            ctx.status = 400;
            ctx.body = {msg: '提交了错误的信息'}; 
        }
    }
});


/**
 * @router POST api/users/login
 * @desc  登录接口地址
 * @access  接口公开
 */
router.post('/login', async ctx => {
    try {
        const sno = ctx.request.body.sno;
        const findResult = await User.find({sno: sno});
        if(findResult && findResult.length > 0) {
            const password_hash = findResult[0].password;
            const password = ctx.request.body.password;
            const login = decrypt(password, password_hash);
            if(login) {
                // 返回token
                const payload = { 
                    id: findResult[0].id,
                    name: findResult[0].name,
                }
                const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600});

                ctx.status = 200;
                ctx.body = { msg: '登录成功', token: 'Bearer ' + token};
            } else {
                ctx.status = 401;
                ctx.body = { msg: '用户名或密码错误'}
            }
        } else {
            ctx.status = 401;
            ctx.body = { msg: '用户名或密码错误'}
        }
    }
    catch {
        ctx.status = 400;
        ctx.body = { msg: 'error'}
    }
})


/**
 * @router GET api/users/current
 * @desc  用户信息接口地址接口地址
 * @access  接口私密
 */
router.get(
    '/current', 
    passport.authenticate('jwt', { session: false }), 
    async ctx => {
        ctx.status = 200
        ctx.body = {
            uid: ctx.state.user.uid,
            sno: ctx.state.user.sno,
            name: ctx.state.user.username,
            email: ctx.state.user.email,
            avatar: ctx.state.user.avatar,
            major: ctx.state.user.major,
            task: ctx.state.user.task,
            admin: ctx.state.user.admin
        };
})



/**
 * @desc 修改用户资料(邮箱或头像)
 * @access 接口私密
 */
router.post(
    '/update',
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        const file = ctx.request.files.file
        const {uid, email} = ctx.request.body
        if(file) {
            // 修改头像和email
            // 找到就图像并删除
            
            // 修改资料
            const pathSplit = file.path.split('\\');
            const url = `/upload/${pathSplit[pathSplit.length - 1]}`;
            await User.update({uid}, {email, avatar: url})
            ctx.status = 200
            ctx.body = {
                message: 'avatar and email have updated'
            }
        } else {
            // 只修改email
            await User.update({uid}, {email})
            ctx.status = 200
            ctx.body = {
                message: 'email has updated'
            }
        }
    }
)


module.exports = router.routes();