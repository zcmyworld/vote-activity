
class HttpApi {
  constructor(ctx) {
    this.ctx = ctx;
  }


  invalidArgumentException() {
    this.ctx.status = 400;
    this.ctx.body = {
      code: 400,
      message: "参数异常",
      data: {}
    }
  }

  unauthorized() {
    this.ctx.status = 401;
    this.ctx.body = {
      code: 401,
      message: "用户未登录",
      data: {}
    }
  }

  AccessDeniedHttpException() {
    this.ctx.status = 403;
    this.ctx.body = {
      code: 403,
      message: "没有访问权限",
      data: {}
    }
  }

  custom(status = 200, message = "", data = {}) {
    this.ctx.status = status;
    this.ctx.body = {
      code: status,
      message: message,
      data: data
    }
  }

  created(data = {}) {
    this.ctx.status = 201;
    this.ctx.body = {
      code: 201,
      message: "创建成功",
      data: data
    }
  }

  success(data = {}) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: 200,
      message: "请求成功",
      data: data
    }
  }

  systemException(data = {}) {
    this.ctx.status = 500;
    this.ctx.body = {
      code: 500,
      message: "系统异常",
      data: data
    }
  }
}

module.exports = HttpApi;