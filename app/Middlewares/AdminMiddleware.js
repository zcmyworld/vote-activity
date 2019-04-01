/**
 * 判断当前请求是否为管理员
 */
const Config = require('../Configs');
module.exports = async function (ctx, next) {
  let email = ctx.passport.email;
  let isAdmin = checkIsAdmin(email);
  //非管理员禁止操作
  if (!isAdmin) {
    return ctx.httpApi.AccessDeniedHttpException();
  }
  await next();
}

function checkIsAdmin(email) {
  for (let i in Config.system.admin.emails) {
    if (email == Config.system.admin.emails[i]) {
      return true;
    }
  }
  return false;
}