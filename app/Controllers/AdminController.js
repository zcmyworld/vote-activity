const AdminRedis = require('../Models/AdminRedis');
const ActService = require('../Services/ActService');

class AdminController {
  /**
   * @api {POST} /api/v1/admin/acttime 设置活动时间
   * @apiGroup Admin
   * @apiHeader {String} utoken 用户登录令牌
   * @apiParam {Int} startTime 活动开始时间
   * @apiParam {Int} endTime 活动结束时间
   * @apiSuccessExample 200
   *     {
   *       "code": 0,
   *       "message": "请求成功",
   *       "data": {}
   *     }
   * @apiErrorExample 400
   *     {
   *       "code": 0,
   *       "message": "请求参数不正确",
   *       "data": {},
   *     }
   * @apiErrorExample 403
   *     {
   *       "code": 0,
   *       "message": "用户没有权限",
   *       "data": {},
   *     }
   */
  async setActTime(ctx) {
    let startTime = ctx.httpValidate.body('startTime').isTimeStamp().end();
    let endTime = ctx.httpValidate.body('endTime').isTimeStamp().end();
    if (ctx.httpValidate.error()) {
      return ctx.httpApi.invalidArgumentException();
    }
    let isActStart = await ActService.isActStart();

    //如果活动已经开始，禁止进行修改时间的操作
    if (isActStart) {
      return ctx.httpApi.AccessDeniedHttpException();
    }

    //将开始和结束时间保存到Redis
    let rs = await AdminRedis.setActTime(startTime, endTime);
    if (!rs) {
      return ctx.httpApi.systemException();
    }

    return ctx.httpApi.created();
  }


  /**
   * @api {GET} /api/v1/admin/acttime 获取活动时间
   * @apiGroup Admin
   * @apiHeader {String} utoken 用户登录令牌
   * @apiSuccessExample 200
   *     {
   *       "code": 0,
   *       "message": "请求成功",
   *       "data": {
   *         startTime: startTime,
   *         endTime: endTime,
   *       },
   *     }
   * @apiErrorExample 403
   *     {
   *       "code": 0,
   *       "message": "用户没有权限",
   *       "data": {},
   *     }
   */
  async getActTime(ctx) {
    let rs = await AdminRedis.getActTime();
    return ctx.httpApi.success(rs);
  }

}

module.exports = new AdminController();