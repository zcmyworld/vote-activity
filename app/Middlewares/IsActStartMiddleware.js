/**
 * 判断当前是否在活动期间
 */

const ActService = require('../Services/ActService');
module.exports = async function (ctx, next) {
  let isStart = await ActService.isActStart();
  if (!isStart) {
    return ctx.httpApi.AccessDeniedHttpException();
  }
  await next();
}