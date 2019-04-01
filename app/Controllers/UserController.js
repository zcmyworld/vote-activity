
const UserService = require("../Services/UserService");
const CandidateService = require('../Services/CandidateService');
const Log = require("../Tools/Log");

class UserController {
  /**
   * @api {POST} /api/v1/user/login 用户登录
   * @apiGroup User
   * @apiParam {String} email 邮箱
   * @apiParam {String} password 密码 
   * @apiSuccessExample 200
   *     {
   *       "code": 0,
   *       "message": "登录成功",
   *       "data": {
   *         "utoken": "xxx"
   *       },
   *     }
   * @apiSuccessExample 201
   *     {
   *       "code": 0,
   *       "message": "创建成功",
   *       "data": {
   *       },
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
  async login(ctx) {
    let email = ctx.httpValidate.body('email').isEmail().end();
    let password = ctx.httpValidate.body('password').lengthLimit(">=", 6).lengthLimit("<=", 30).end();
    if (ctx.httpValidate.error()) {
      return ctx.httpApi.invalidArgumentException();
    }

    let user = await UserService.getUserByEmail(email);

    //账户不存在，创建新账户, 发送激活邮件
    if (!user) {
      await UserService.create(email, password);
      await UserService.sendActiveEmail(email);
      return ctx.httpApi.created();
    }

    //账户已存在，但未激活，发送激活邮件
    if (!user.isActive) {
      await UserService.sendActiveEmail(email);
      return ctx.httpApi.created();
    }

    //账户存在，已激活，直接登录
    let utoken = await UserService.login(user, password);

    //密码错误
    if (!utoken) {
      return ctx.httpApi.custom(403, "密码错误");
    }

    return ctx.httpApi.success({
      utoken: utoken
    });
  }

  /**
   * @api {GET} /api/v1/user/vote 用户投票
   * @apiGroup User
   * @apiHeader {String} utoken 用户登录令牌
   * @apiSuccessExample 200
   *     {
   *       "code": 0,
   *       "message": "请求成功",
   *       "data": {
   *       },
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
  async vote(ctx) {
    let uid = ctx.passport.uid;
    let cuids = ctx.httpValidate.body('cuids').notEmpty().end();
    if (ctx.httpValidate.error()) {
      return ctx.httpApi.invalidArgumentException();
    }
    //判断是否已经投过票
    let isVoted = await UserService.isVoted(uid);
    if (isVoted) {
      Log.warn(`uid:${uid} - 用户已经投票`);
      return ctx.httpApi.custom(403, {}, "用户已经投票");
    }

    //判断cuids是否合法
    let isCuidsExist = await CandidateService.isCuidsExist(cuids);
    if (!isCuidsExist) {
      Log.warn(`uid:${uid} - cuids非法`);
      return ctx.httpApi.custom(403, {}, "cuids非法");
    }

    //判断是否有足够的票数
    let isVotesEnough = await UserService.isVotesEnough(cuids);
    if (!isVotesEnough) {
      Log.warn(`uid:${uid} - 票数超出限制`);
      return ctx.httpApi.custom(403, {}, "用户投票人数超过限制");
    }

    //进行投票
    let isVoteSuccess = await UserService.vote(uid, cuids);

    if (!isVoteSuccess) {
      return ctx.httpApi.sysException();
    }
    Log.info(`uid:${uid} - 投票成功`);

    return ctx.httpApi.success();
  }


  /**
   * @api {GET} /api/v1/user/active/:urltoken 用户激活
   * @apiGroup User
   * @apiSuccessExample 200
   *     {
   *       "code": 0,
   *       "message": "请求成功",
   *       "data": {
   *         "utoken": "xxx"
   *       },
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
  async active(ctx) {
    let urltoken = ctx.httpValidate.params('urltoken').end();
    if (ctx.httpValidate.error()) {
      return ctx.httpApi.invalidArgumentException();
    }
    let isActiveSuccess = await UserService.active(urltoken);

    //激活失败
    if (!isActiveSuccess) {
      return ctx.httpApi.AccessDeniedHttpException();
    }

    return ctx.httpApi.success();
  }
}

module.exports = new UserController();