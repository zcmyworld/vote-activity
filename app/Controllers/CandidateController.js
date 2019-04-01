const ActService = require('../Services/ActService');
const CandidateService = require('../Services/CandidateService');

class CandidateController {
  /**
   * @api {GET} /api/v1/candidates 获取候选人列表
   * @apiGroup Candidates
   * @apiHeader {String} utoken 用户登录令牌
   * @apiSuccessExample 200
   *     {
   *       "code": 0,
   *       "message": "登录成功",
   *       "data": {
   *         "candidates": [{
   *           cuid: 10,
   *           name: "姓名",
   *           info: 消息",
   *           createdAt: "创建时间",
   *           votes: "当前票数"
   *         }]
   *       },
   *     }
   * @apiErrorExample 403
   *     {
   *       "code": 0,
   *       "message": "用户没有权限",
   *       "data": {},
   *     }
   */
  async candidates(ctx) {
    let candidates = await CandidateService.list();
    return ctx.httpApi.success({ candidates: candidates });
  }

  /**
   * @api {PUT} /api/v1/candidate 添加候选人
   * @apiGroup Candidates
   * @apiHeader {String} utoken 用户登录令牌
   * @apiSuccessExample 201
   *     {
   *       "code": 0,
   *       "message": "添加成功",
   *       "data": {
   *         "candidates": []
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
  async create(ctx) {
    let name = ctx.httpValidate.body('name').notEmpty().lengthLimit(">", 0).lengthLimit("<", 10).end();
    let info = ctx.httpValidate.body('info').notEmpty().lengthLimit(">", 10).lengthLimit("<", 30).end();
    if (ctx.httpValidate.error()) {
      return ctx.httpApi.invalidArgumentException();
    }

    //如果活动已经开始，则禁止对候选人进行操作 
    let isActStart = await ActService.isActStart();
    if (isActStart) {
      return ctx.httpApi.AccessDeniedHttpException();
    }

    await CandidateService.create(name, info);

    return ctx.httpApi.created();
  }

  /**
   * @api {POST} /api/v1/candidate/:cuid 修改候选人信息
   * @apiGroup Candidates
   * @apiHeader {String} utoken 用户登录令牌
   * @apiSuccessExample 200
   *     {
   *       "code": 0,
   *       "message": "请求成功",
   *       "data": {
   *         "candidates": []
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
  async edit(ctx) {
    let cuid = ctx.httpValidate.params('cuid').notEmpty().end();
    let info = ctx.httpValidate.body('info').notEmpty().end();
    let name = ctx.httpValidate.body('name').notEmpty().end();
    if (ctx.httpValidate.error()) {
      return ctx.httpApi.invalidArgumentException();
    }
    
    //如果活动已经开始，则禁止对候选人进行操作 
    let isActStart = await ActService.isActStart();
    if (isActStart) {
      return ctx.httpApi.AccessDeniedHttpException();
    }

    await CandidateService.edit(cuid, info, name);
    return ctx.httpApi.success();
  }


  /**
   * @api {DELETE} /api/v1/candidate/:cuid 删除候选人
   * @apiGroup Candidates
   * @apiHeader {String} utoken 用户登录令牌
   * @apiSuccessExample 200
   *     {
   *       "code": 0,
   *       "message": "删除成功",
   *       "data": {
   *         "candidates": []
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
  async dropCandidate(ctx) {
    let cuid = ctx.httpValidate.params('cuid').end();
    if (ctx.httpValidate.error()) {
      return ctx.httpApi.invalidArgumentException();
    }
    //如果活动已经开始，则禁止对候选人进行操作 
    let isActStart = await ActService.isActStart();
    if (isActStart) {
      return ctx.httpApi.AccessDeniedHttpException();
    }

    await CandidateService.drop(cuid);

    //如果活动已经开始，则禁止对候选人进行操作 
    return ctx.httpApi.success();
  }

}

module.exports = new CandidateController();