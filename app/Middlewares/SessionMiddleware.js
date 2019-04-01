/**
 * 获取用户登录状态
 */

const SessionModel = require('../Models/Session');
module.exports = async function (ctx, next) {
  let utoken = ctx.request.header.utoken;
  let user = await SessionModel.parse(utoken);
  if (!user) {
    //用户未登录，禁止访问
    return ctx.httpApi.AccessDeniedHttpException();
  }
  ctx.passport = {};
  ctx.passport.email = user.email;
  ctx.passport.uid = user.uid;
  await next();
}
