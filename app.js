const Koa = require("koa");
const Router = require("koa-router");
var cors = require('koa2-cors');
const mongoose = require("mongoose");
// const bodyParser = require("koa-bodyparser");
const koaBody = require('koa-body');
const static = require('koa-static')
const passport = require('koa-passport');

const path = require('path') 

const DB_URL = require("./config/keys").DB_URL;


// 实例化koa
const app = new Koa();
const router = new Router();

// 允许跨域
app.use(cors());

// 允许获取静态文件
app.use(static(
    path.join( __dirname, './public')
))

// 得到前端发来的数据request
// app.use(bodyParser());


/**
 * 测试
 * 文件上传
 */
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, './public/upload'),
        keepExtensions: true,
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));




// 引入api
const users = require("./routes/api/users");
const file = require("./routes/api/file");
const study = require("./routes/api/study");
const other = require("./routes/api/other");

// 路由
router.get("/", async (ctx) => {
    ctx.body = { msg: "hello koa" }
});

router.post("/post", async (ctx) => {
    console.log(ctx.request.body);
    ctx.body = { msg: "hello koa" }
});


// 连接数据库
mongoose.connect(DB_URL, { useNewUrlParser: true })
    .then(() => {
        console.log('连接成功');
    })
    .catch((err) => {
        console.log(err);
    })

app.use(passport.initialize())
app.use(passport.session())

// 回调到config文件中passport.js
require("./config/passport")(passport);

// 配置路由地址
router.use("/api/users", users);
router.use("/api/file", file);
router.use("/api/study", study);
router.use("/api/other", other);


// 配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`监听在 ${port}`)
})
