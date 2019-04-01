const Redis = require('./Redis');

class CandidateRedis {
  constructor() {
    //候选人列表，分值为投票数
    this.candidatesSortedSetKey = "candidates";

    //候选人详情
    this.candidateInfoHashPrefixKey = "candidate:";

    //获取Redis连接
    this.redisClient = Redis.getClient();
  }

  /**
   * 获取候选人列表
   * @return {Array} 候选人列表
   */
  async list() {
    let rs = await this.redisClient.zrevrangebyscoreAsync(this.candidatesSortedSetKey, 0, -1, 'withscores');
    return rs;
  }

  /**
   * 候选人票数+1
   * @param {int} cuid 候选人id
   */
  async votesIncr(cuid) {
    let rs = await this.redisClient.zincrby(this.candidatesSortedSetKey, 1, cuid);
    return rs;
  }

  /**
   * 更新候选人信息
   * @param {Int} cuid 候选人id
   * @param {String} name 候选人名字
   * @param {String} info 候选人信息
   * @return {Boolean}
   */
  async update(cuid, name, info) {
    let rs = await this.redisClient.hmsetAsync(`${this.candidateInfoHashPrefixKey}${cuid}`, {
      cuid: cuid,
      name: name,
      info: info,
    })
    if (rs != "OK") {
      return false;
    }
    return true;

  }

  /**
   * 添加候选人
   * @param {Int} cuid 候选人id
   * @param {String} name 候选人名字
   * @param {String} info 候选人信息
   * @param {String} createdAt 创建时间
   * @return {Boolean}
   */
  async create(cuid, name, info, createdAt) {
    let rs = await this.redisClient.hmsetAsync(`${this.candidateInfoHashPrefixKey}${cuid}`, {
      cuid: cuid,
      name: name,
      info: info,
      createdAt: createdAt
    })
    if (rs != "OK") {
      return false;
    }
    return true;
  }

  /**
   * 根据cuid获取候选人信息
   * @param {Int} cuid 候选人id
   * @return {Object} 候选人信息
   */
  async getOne(cuid) {
    let rs = await this.redisClient.hgetallAsync(`${this.candidateInfoHashPrefixKey}${cuid}`);
    return rs;
  }

  /**
   * 候选人加入到列表中
   * @param {Int} cuid 候选人id
   * @return {Boolean} 
   */
  async pushToList(cuid) {
    //新建候选人默认票数为0
    let rs = await this.redisClient.zaddAsync(this.candidatesSortedSetKey, 0, cuid);
    if (rs != "1") {
      return false;
    }
    return true;
  }

  /**
   * 删除候选人详情
   * @param {Int} cuid 候选人id
   * @return {Boolean} 
   */
  async drop(cuid) {
    let rs = await this.redisClient.delAsync(`${this.candidateInfoHashPrefixKey}${cuid}`);
    if (rs != "1") {
      return false;
    }
    return true;
  }

  /**
   * 将候选人从列表中移除
   * @param {Int} cuid 候选人id
   * @return {Boolean} 
   */
  async removeFromList(cuid) {
    let rs = await this.redisClient.zremAsync(`${this.candidatesSortedSetKey}`, cuid);
    if (rs != "1") {
      return false;
    }
    return true;
  }

}

module.exports = new CandidateRedis();