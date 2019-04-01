
const Redis = require('./Redis');

class UserRedis {

  constructor() {
    //投票人信息
    this.userVoteHashPrefixKey = "voted:";

    //投票人队列
    this.userVoteListKey = "votesinfo";

    //获取Redis连接
    this.redisClient = Redis.getClient();
  }

  /**
   * 将已投票者记录到队列
   * @param uid 用户id
   */
  async pushToUserVoteList(uid) {
    let rs = await this.redisClient.rpushAsync(this.userVoteListKey, uid);
  }

  /*
   * 记录投票信息
   * @param {Int} uid 投票者id
   * @param {Int} cuid 候选人id
   */
  async vote(uid, cuids) {
    let rs = await this.redisClient.hmsetAsync(`${this.userVoteHashPrefixKey}${uid}`, {
      cuids: cuids,
      createdAt: new Date().getTime()
    })
    if (rs != "OK") {
      return false;
    }
    return true;
  }

  /**
   * 获取投票者信息
   * @param {Int} uid 投票者id
   * @return {Obj} user 投票者信息
   */
  async getOne(uid) {
    let rs = await this.redisClient.hgetallAsync(`${this.userVoteHashPrefixKey}${uid}`);
    return rs;
  }
}

module.exports = new UserRedis();