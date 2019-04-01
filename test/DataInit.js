

const Pool = require('../app/Models/Pool');
const Redis = require('../app/Models/Redis');
const co = require('co');
const app = require('../app');
const superagent = require('supertest');
const uuidv1 = require('uuid/v1')

function request() {
  return superagent(app.listen())
}


class DataInit {

  constructor() {
    this.redisClient = Redis.getClient();
  }

  /**
   * 初始化所有数据
   */
  async init() {
    await new DataInit().flushAll();
    await new DataInit().initCandidate()
    await new DataInit().initUser();
  }

  /**
   * 使用Admin账号登录
   * @Return utoken
   */
  async loginWithAdmin() {
    let sendData = {
      email: 'admin@qq.qq',
      password: '1234qwer'
    }
    let utoken = await new Promise((resolve, reject) => {
      request().post("/api/v1/user/login")
        .send(sendData)
        .end(function (err, res) {
          resolve(res.body.data.utoken)
        })
    })
    return utoken;
  }

  /**
   * 设置活动时间为开始
   */
  async setActStart() {
    let startTime = new Date().getTime() - 10000;
    let endTime = new Date().getTime() + 10000;
    await this.redisClient.hmsetAsync("acttime", {
      startTime: startTime,
      endTime: endTime
    })
  }

  /**
   * 设置活动时间为未开始
   */

  async setActUnStart() {
    let startTime = new Date().getTime() + 10000;
    let endTime = new Date().getTime() + 20000;
    await this.redisClient.hmsetAsync("acttime", {
      startTime: startTime,
      endTime: endTime
    })
  }

  /**
   * 使用投票者账号登录
   * @Return utoken
   */
  async loginWithUser() {
    let sendData = {
      email: 'test1@qq.qq',
      password: '1234qwer'
    }
    let utoken = await new Promise((resolve, reject) => {
      request().post("/api/v1/user/login")
        .send(sendData)
        .end(function (err, res) {
          resolve(res.body.data.utoken)
        })
    })
    return utoken;
  }

  /**
   * 获取urlToken
   */
  async getUrlToken(email) {
    let urltoken = uuidv1().replace(/-/g, '');
    let redisKey = `urltoken:${urltoken}`;
    await this.redisClient.hmsetAsync(redisKey, {
      email: email
    })
    return urltoken
  }

  /**
   * 清空user表
   */
  async flushUser() {
    let sql = "delete from va_users";
    let args = [];
    let rs = await Pool.queryAsync(sql, args);
  }

  /**
   * 初始化投票者
   */
  async initUser() {
    async function create(id, email, md5_password, isActive) {
      let sql = "insert va_users (id, email, password, isActive, createdAt, activedAt)values (?,?,?,?,?,?)";
      let args = [id, email, md5_password, isActive, new Date().getTime(), new Date().getTime()];
      let rs = await Pool.queryAsync(sql, args);
    }
    //创建10个投票者
    for (let i = 1; i <= 10; i++) {
      await create(i, `test${i}@qq.qq`, '9b3ec0abdbddb30e877062d5f6c06a2d', 1);
    }

    //创建管理员
    await create(11, `admin@qq.qq`, '9b3ec0abdbddb30e877062d5f6c06a2d', 1);

    //创建未激活账号
    await create(12, `unActiveAccount@qq.qq`, '9b3ec0abdbddb30e877062d5f6c06a2d', -1);
  }

  /**
   * 初始化候选人
   */
  async initCandidate() {
    async function create(id, name, info) {
      let sql = "insert va_candidates (id, name, info, createdAt)values (?,?,?,?)";
      let args = [id, name, info, new Date().getTime()];
      let rs = await Pool.queryAsync(sql, args);
    }
    //创建10个候选人
    for (let i = 1; i <= 10; i++) {
      let id = i;
      let name = `候选人${i}`;
      let info = `候选人${i}非常出众，希望大家能投他一票`;
      await create(id, name, info);
      await this.redisClient.hmsetAsync(`candidate:${id}`, {
        cuid: id,
        name: name,
        info: info,
        createdAt: new Date().getTime()
      })

      await this.redisClient.zaddAsync("candidates", 0, id);
    }
  }

  /**
   * 清除所有候选人
   */
  async flushCandidate() {
    let sql = "delete from va_candidates";
    let args = [];
    let rs = await Pool.queryAsync(sql, args);
  }


  /**
   * 清空 Redis
   */
  async flushRedis() {
    await this.redisClient.flushallAsync();
  }

  /**
   * 清除所有测试数据
   */
  async flushAll() {
    await this.flushUser();
    await this.flushCandidate();
    await this.flushRedis();
  }

}

module.exports = new DataInit();


co(async function () {
  // await new DataInit().getUrlToken();
    // await new DataInit().flushAll();
    // await new DataInit().initCandidate()
    // await new DataInit().initUser();
  //   let admin_utoken = await new DataInit().loginWithAdmin();
  //   let user_utoken = await new DataInit().loginWithUser();
})