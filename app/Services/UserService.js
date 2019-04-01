
const crypto = require('crypto');
const UserMysql = require('../Models/UserMysql');
const config = require('../Configs');
const SessionModel = require("../Models/Session");
const EmailService = require("./EmailService");
const UserRedis = require("../Models/UserRedis");
const CandidateService = require('./CandidateService');

class UserService {

  constructor() {
    this.PASSWORDSALT = "va";
  }

  /**
   * 投票
   * @param {Int} uid 投票者
   * @param {String} cuids 候选人字符串
   */
  async vote(uid, cuids) {
    try {
      //记录投票人所投的票
      await UserRedis.vote(uid, cuids);

      //候选人票数+1
      await CandidateService.votesIncr(cuids);

      //将这个投票行为记录到队列
      await UserRedis.pushToUserVoteList(uid);

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 判断是否已经投过票
   * @param {Int} uid 投票者id
   * @return {Boolean}
   */
  async isVoted(uid) {
    let rs = await UserRedis.getOne(uid);
    if (!rs) {
      return false;
    }
    return true;
  }

  /**
   * 判断投票人所投票票数是否符合投票规则
   * @param {String}  cuids
   * @return {Boolean}
   */
  async isVotesEnough(cuids) {
    try {
      let cuidsArr = cuids.split(',');
      let candidateLength = await CandidateService.count();
      if (cuidsArr.length < 2 || cuidsArr.length > 5 || cuidsArr.length > candidateLength / 2) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }


  /**
   * 使用 urltokn 激活用户
   * @param {String} urltoken
   * @return {Boolean}
   */
  async active(urltoken) {
    //解析urltoken
    let obj = await SessionModel.parseUrlToken(urltoken);

    //urltoken无效
    if (!obj) {
      return false;
    }

    //更新MySQL为激活状态
    await UserMysql.active(obj.email);

    //激活完成删除urltoken
    await SessionModel.dropUrlToken(urltoken);
    return true;
  }

  /**
   * 根据用户邮箱获取用户信息
   * @param {String} email 用户邮箱
   * @return {Object} user
   */
  async getUserByEmail(email) {
    let user = await UserMysql.getUserByEmail(email);
    if (!user) {
      return null;
    }
    user.isActive == -1 ? user.isActive = false : user.isActive = true;
    return user;
  }

  /**
   * 进行登录操作
   * @param {Object} user 用户数据库信息
   * @param {String} password 用户输入的密码 
   * @return {String/Boolean} utoken 密码正确返回utoken，错误返回false
   */
  async login(user, password) {
    let md5_password = this.cryptoPassword(password);
    if (user.password != md5_password) {
      return false;
    }
    let utoken = await SessionModel.save({
      email: user.email,
      uid: user.id
    });
    return utoken;
  }

  /**
   * 发送激活邮件
   * @param {String} email 用户邮箱
   */
  async sendActiveEmail(email) {
    let urltoken = await SessionModel.createUrlToken(email);
    let title = "欢迎注册";
    let content = "<p>请点击以下链接完成注册</p>";
    content += `<p>${config.system.host}/api/v1/user/active/${urltoken}</p>`;
    //不需要加await，实现异步操作
    EmailService.sendEmail(title, content, email);
  }



  /**
   * 创建账户
   * @param {String} email 用户邮箱
   * @param {String} password 用户密码
   * @return {Boolean}
   */
  async create(email, password) {
    let md5_password = this.cryptoPassword(password);
    let rs = await UserMysql.create(email, md5_password);
    if (!rs) {
      return false;
    }
    return true;
  }

  /**
   * 对密码加盐
   * @param {String} password
   * @return {String} md5_password
   */
  cryptoPassword(password) {
    let md5 = crypto.createHash("md5");
    md5.update(this.PASSWORDSALT + password);
    let md5_password = md5.digest('hex');
    return md5_password;
  }
}


module.exports = new UserService();