const Redis = require('./Redis');
const configs = require('../Configs');
const uuidv1 = require('uuid/v1')

class Session {
  constructor() {
    //保存用户会话的hash
    this.userSessionHashPrefixKey = "session:";

    //保存 urltoken 的 hash
    this.urlTokenHashPrefixKey = "urltoken:";

    //获取Redis连接
    this.redisClient = Redis.getClient();
  }

  /**
   * 解析 utoken
   * @param {String} utoken 用户登录令牌
   * @return {Object} 用户信息
   */
  async parse(utoken) {
    let redisKey = `${this.userSessionHashPrefixKey}${utoken}`;
    let user = await this.redisClient.hgetallAsync(redisKey);
    return user;
  }

  /**
   * 创建会话
   * @param {Object} user 用户信息
   * @return {String} utoken
   */
  async save(user) {
    let utoken = uuidv1().replace(/-/g, '');
    let redisKey = `${this.userSessionHashPrefixKey}${utoken}`;

    await this.redisClient.hmsetAsync(redisKey, {
      email: user.email,
      uid: user.uid
    })

    await this.redisClient.expireAsync(redisKey, configs.session.session_expire_in_seconds);

    return utoken;
  }

  /**
   * 创建 urlToken
   * @param {String} email 用户邮箱
   * @return {String} urltoken
   */
  async createUrlToken(email) {
    let urltoken = uuidv1().replace(/-/g, '');
    let redisKey = `${this.urlTokenHashPrefixKey}${urltoken}`;
    await this.redisClient.hmsetAsync(redisKey, {
      email: email
    })
    await this.redisClient.expireAsync(redisKey, configs.session.urlToken_expire_in_seconds);

    return urltoken;
  }

  /**
   * 解析urltoken
   * @param {String} urltoken  用户urltoken 
   * @return {Object} user 用户信息
   */
  async parseUrlToken(urltoken) {
    let redisKey = `${this.urlTokenHashPrefixKey}${urltoken}`;
    let user = await this.redisClient.hgetallAsync(redisKey);
    return user;
  }

  /*
   * 删除urltoken
   * @param {String} urltoken 用户urltoken
   * @return {Boolean} 
   */
  async dropUrlToken(urltoken) {
    let redisKey = `${this.urlTokenHashPrefixKey}${urltoken}`;
    let rs = await this.redisClient.delAsync(redisKey);
    return rs;
  }
}

module.exports = new Session();