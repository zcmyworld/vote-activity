const superagent = require('supertest');
const should = require('should');
const app = require('../app');
const DataInit = require('./DataInit');

function request() {
  return superagent(app.listen())
}


describe('Candidate test start ...', function () {

  before(async function () {
    await DataInit.init();
    await DataInit.setActStart();
  });

  after(async function () {
  });

  describe('#1-0-0 PUT /api/v1/candidate', function () {
    let router = '/api/v1/candidate';
    it('#1-0-1 管理员添加候选人成功', async function () {
      let utoken = await DataInit.loginWithAdmin();
      await DataInit.setActUnStart();
      let sendData = {
        name: "候选人A",
        info: "非常出众,墙裂推荐大家投这个候选人"
      }
      await new Promise((resolve, reject) => {
        request().put(router)
          .set('utoken', utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(201);
            resolve()
          })
      })
    });
    it('#1-0-2 非管理员无法进行此操作', async function () {
      await DataInit.setActStart();
      let utoken = await DataInit.loginWithUser();
      let sendData = {
        name: "候选人A",
        info: "非常出众,墙裂推荐大家投这个候选人"
      }
      await new Promise((resolve, reject) => {
        request().put(router)
          .set('utoken', utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
    it('#1-0-3 活动已经开始，无法进行此操作', async function () {
      await DataInit.setActStart();
      let utoken = await DataInit.loginWithAdmin();
      let sendData = {
        name: "候选人A",
        info: "非常出众,墙裂推荐大家投这个候选人"
      }
      await new Promise((resolve, reject) => {
        request().put(router)
          .set('utoken', utoken)
          .send(sendData)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
  })

  describe('#1-1-0 DELETE /api/v1/candidate', function () {
    let router = '/api/v1/candidate/5';
    it('#1-1-1 管理员删除候选人成功', async function () {
      let utoken = await DataInit.loginWithAdmin();
      await DataInit.setActUnStart();
      await new Promise((resolve, reject) => {
        request().delete(router)
          .set("utoken", utoken)
          .end(function (err, res) {
            res.body.code.should.be.eql(200);
            resolve()
          })
      })
    });
    it('#1-1-2 活动已经开始，无法进行此操作', async function () {
      await DataInit.setActStart();
      let utoken = await DataInit.loginWithAdmin();
      let sendData = {
        name: "候选人A",
        info: "非常出众,墙裂推荐大家投这个候选人"
      }
      let router = '/api/v1/candidate/6';
      await new Promise((resolve, reject) => {
        request().delete(router)
          .set('utoken', utoken)
          .end(function (err, res) {
            res.body.code.should.be.eql(403);
            resolve()
          })
      })
    });
  })


  describe('#1-2-0 GET /api/v1/candidates', function () {
    let router = '/api/v1/candidates';
    it('#1-2-1 获取候选人列表', async function () {
      await new Promise((resolve, reject) => {
        request().get(router)
          .end(function (err, res) {
            res.body.code.should.be.eql(200);
            res.body.data.should.have.property('candidates');
            resolve()
          })
      })
    });
  })

  describe('#1-3-0 POST /api/v1/candidate', function () {
    it('#1-3-1 更新候选人信息', async function () {
      let router = '/api/v1/candidate/1';
      await DataInit.setActStart();
      let utoken = await DataInit.loginWithAdmin();
      await DataInit.setActUnStart();
      let sendData = {
        name: "hello",
        info: "hellohellohellohellohello"
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
    it('#1-3-2 活动已经开始，禁止更新候选人信息', async function () {
      let router = '/api/v1/candidate/1';
      await DataInit.setActStart();
      let utoken = await DataInit.loginWithAdmin();
      let sendData = {
        name: "hello",
        info: "hellohellohellohellohello"
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