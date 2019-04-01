
const superagent = require('supertest');
const should = require('should');
const app = require('../app');
const DataInit = require('./DataInit');

function request() {
  return superagent(app.listen())
}


describe('User test start ...', function () {
  before(async function () {
    await DataInit.init();
  });

  beforeEach(async function() {
    await DataInit.setActStart();
  })

  after(async function () {
  });

  describe('#2-0-0 POST /api/v1/user/login', function () {
    let router = '/api/v1/user/login';
    it('#2-0-1 用户不存在，执行注册操作，未激活，发送激活邮件', async function () {
      let sendData = {
        email: 'test@qq.qq',
        password: '1234qwer'
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(201);
            resolve()
          })
      })
    });
    it('#2-0-2 用户已经注册，进行登录', async function () {
      let sendData = {
        email: 'test1@qq.qq',
        password: '1234qwer'
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(200);
            res.body.data.should.have.property('utoken');
            resolve()
          })
      })
    });
    it('#2-0-3 用户已经注册，未激活，发送激活邮件', async function () {
      let sendData = {
        email: 'unActiveAccount@qq.qq',
        password: '1234qwer'
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(201);
            resolve()
          })
      })
    });
    it('#2-0-4 活动还没开始，不可以登录注册', async function () {
      await DataInit.setActUnStart();
      let sendData = {
        email: 'unActiveAccount@qq.qq',
        password: '1234qwer'
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
    it('#2-0-5 密码错误，登录失败', async function () {
      await DataInit.setActStart();
      let sendData = {
        email: 'test1@qq.qq',
        password: 'wrongpassword'
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
  })

  describe('#2-1-0 GET /api/v1/user/active/:urltoken', function () {
    it('#2-1-1 用户激活', async function () {
      let email = "unActiveAccount@qq.qq";
      let urltoken = await DataInit.getUrlToken(email);
      let router = `/api/v1/user/active/${urltoken}`;
      await new Promise((resolve, reject) => {
        request().get(router)
          .end(function (err, res) {
            res.body.code.should.be.eql(200);
            resolve()
          })
      })
    });
    it('#2-1-2 urltoken不存在，激活失败', async function () {
      let urltoken = "123";
      let router = `/api/v1/user/active/${urltoken}`;
      await new Promise((resolve, reject) => {
        request().get(router)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
    it('#2-1-3 活动还没开始，不可以激活', async function () {
      await DataInit.setActUnStart();
      let email = "unActiveAccount@qq.qq";
      let urltoken = await DataInit.getUrlToken(email);
      let router = `/api/v1/user/active/${urltoken}`;
      await new Promise((resolve, reject) => {
        request().get(router)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
  })

  describe('#2-2-0 POST /api/v1/user/vote', function () {
    beforeEach(async function () {
      await DataInit.init();
      await DataInit.setActStart();
    });
    let router = `/api/v1/user/vote`;
    it('#2-2-1 用户投票成功', async function () {
      let utoken = await DataInit.loginWithUser();
      let sendData = {
        cuids: "1,2,3"
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set("utoken", utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(200);
            resolve()
          })
      })
    });
    it('#2-2-2 用户重复投票', async function () {
      let utoken = await DataInit.loginWithUser();
      let sendData = {
        cuids: "1,2,3"
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set("utoken", utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(200);
            request().post(router)
              .set("utoken", utoken)
              .send(sendData)
              .end(function (err, res) {
                res.body.code.should.be.eql(403);
                resolve()
              })
          })
      })
    });
    it('#2-2-3 用户投票cuids非法', async function () {
      let utoken = await DataInit.loginWithUser();
      let router = `/api/v1/user/vote`;
      let sendData = {
        cuids: "[1,2,3..a."
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set("utoken", utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
    it('#2-2-4 用户投票票数超出限制', async function () {
      let utoken = await DataInit.loginWithUser();
      let router = `/api/v1/user/vote`;
      let sendData = {
        cuids: "1,2,3,4,5,6,7,8,9"
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set("utoken", utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });

    it('#2-2-5 用户未登录', async function () {
      let router = `/api/v1/user/vote`;
      let sendData = {
        cuids: "1,2,3"
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set("utoken", '123')
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    })
    it('#2-2-6 活动还没开始，不可以投票', async function () {
      let utoken = await DataInit.loginWithUser();
      await DataInit.setActUnStart();
      let sendData = {
        cuids: "1,2,3"
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set("utoken", utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });

    it('#2-2-7 用户投票包含重复cuid', async function () {
      let utoken = await DataInit.loginWithUser();
      let sendData = {
        cuids: "1,1,1"
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set("utoken", utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
  })
})