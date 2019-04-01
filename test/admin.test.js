const superagent = require('supertest');
const should = require('should');
const app = require('../app');

const DataInit = require('./DataInit');

function request() {
  return superagent(app.listen())
}

describe('Admin test start ...', function () {

  before(async function () {
    await DataInit.init();
    await DataInit.setActStart();
  });

  after(async function () {
  });


  describe('#0-0-0 GET /api/v1/admin/acttime', function () {
    let router = '/api/v1/admin/acttime';
    it('#0-0-1 管理员获取活动时间', async function () {
      let utoken = await DataInit.loginWithAdmin();
      await new Promise((resolve, reject) => {
        request().get(router)
          .set('utoken', utoken)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.be.eql(200);
            resolve()
          })
      })
    });
  })

  describe('#0-1-0 POST /api/v1/admin/acttime', function () {
    let router = '/api/v1/admin/acttime';
    it('#0-1-1 管理员设置活动时间参数不正确', async function () {
      let utoken = await DataInit.loginWithAdmin();
      let sentData = {
        startTime: 1553683561994
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set('utoken', utoken)
          .send(sentData)
          .end(function (err, res) {
            res.body.code.should.be.eql(400);
            resolve()
          })
      })
    });
    it('#0-1-2 管理员正确设置活动时间', async function () {
      let utoken = await DataInit.loginWithAdmin();
      await DataInit.setActUnStart();
      let sentData = {
        startTime: 1553683561994,
        endTime: 1558693561995
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set('utoken', utoken)
          .send(sentData)
          .end(function (err, res) {
            res.body.code.should.be.eql(201);
            resolve()
          })
      })
    });
    it('#0-1-2 活动已经开始进行，禁止进行修改', async function () {
      let utoken = await DataInit.loginWithAdmin();
      await DataInit.setActStart();
      let sentData = {
        startTime: 1553683561994,
        endTime: 1558693561995
      }
      await new Promise((resolve, reject) => {
        request().post(router)
          .set('utoken', utoken)
          .send(sentData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
  })

  describe('#0-2-0 GET /api/v1/admin/acttime', function () {
    let router = '/api/v1/admin/acttime';
    it('#0-2-1 管理员没有操作权限', async function () {
      let utoken = await DataInit.loginWithUser();
      await new Promise((resolve, reject) => {
        request().get(router)
          .set('utoken', utoken)
          .expect(200)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
  })
})