let Koa = require('koa');
let cors = require('koa-cors');
let app = new Koa();
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')({});
let routerHandler = require('./app/Routes/web');
let Log = require("./app/Tools/Log");

app.use(bodyParser());

//参数检查
let HttpValidate = require('./app/Tools/HttpValidate');
app.use(async function (ctx, next) {
  ctx.httpValidate = new HttpValidate(ctx);
  await next();
})

//http返回控制
let HttpApi = require('./app/Tools/HttpApi');
app.use(async (ctx, next) => {
  ctx.httpApi = new HttpApi(ctx);
  await next();
})

//捕捉全局异常
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    Log.error("系统异常..");
    Log.error(error);
    return ctx.httpApi.sysException();
  }
});

//路由处理
routerHandler(router);

//跨域处理
app.use(cors());

app
  .use(router.routes())
  .use(router.allowedMethods());


app.on('error', function (error, ctx) {
  Log.error("系统异常..");
  Log.error(error);
})

if (module.parent) {
  module.exports = app;
} else {
  app.listen(3000);
}

