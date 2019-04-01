const CandidateMysql = require('../Models/CandidateMysql');
const CandidateRedis = require('../Models/CandidateRedis');

class CandidateService {

  /**
   * 获取候选人人数
   * @return {Int} 候选人数量
   */
  async count() {
    let rs = await CandidateRedis.list();
    return rs.length / 2;
  }

  /**
   * 修改候选人信息
   * @param {Int}  cuid
   * @param {String}  name
   * @param {String}  info
   * @return {Boolean}
   */
  async edit(cuid, name, info) {
    //更新Redis缓存
    await CandidateRedis.update(cuid, name, info);

    //更新MySQL信息
    await CandidateMysql.update(cuid, name, info);

    return true;
  }
  /**
   * 创建候选人
   * @param {String} name 
   * @param {String} info 
   * @return {Boolean}
   */
  async create(name, info) {
    //创建时间
    let createdAt = new Date().getTime();
    //候选人加入到MySQL
    let cuid = await CandidateMysql.create(name, info, createdAt);

    if (!cuid) {
      return false;
    }

    //候选人信息保存到 Redis
    await CandidateRedis.create(cuid, name, info, createdAt);

    //候选人加入到 Redis 列表
    await CandidateRedis.pushToList(cuid);

    return true;

  }

  /**
   * 候选人票数+1
   * @param {Int} cuid 候选人id
   */
  async votesIncr(cuids) {
    let cuidsArr = cuids.split(',');
    for (let i in cuidsArr) {
      let cuid = cuidsArr[i];
      await CandidateRedis.votesIncr(cuid);
    }
  }

  /**
   * 判断cuids是否存在 
   * @param {String} cuids 
   * @return {Boolean}
   */
  async isCuidsExist(cuids) {
    try {
      let cuidsArr = cuids.split(',');
      //参数格式有误
      if (cuidsArr.length < 0) {
        return false;
      }

      //判断候选人cuids中是否有重复id
      let isDis = isDistinct(cuidsArr);
      if (!isDis) {
        return false;
      }

      //判断cuid是否确实存在
      for (let i in cuidsArr) {
        let cuid = cuidsArr[i];
        let isExist = await this.isCandidateExist(cuid);
        if (!isExist) {
          return false;
        }
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * 判断候选人是否存在
   * @param {Int} cuid 
   * @return {Boolean}
   */
  async isCandidateExist(cuid) {
    let candidate = await CandidateRedis.getOne(cuid);
    if (!candidate) {
      return false;
    }
    return true;
  }

  /**
   * 删除候选人
   * @param {Int} cuid 
   * @return {Boolean}
   */
  async drop(cuid) {
    //从数据库删除
    await CandidateMysql.drop(cuid);

    //删除候选人详情
    await CandidateRedis.drop(cuid);

    //从 Redis 列表中移除
    await CandidateRedis.removeFromList(cuid);

    return true;
  }

  /**
   * 获取候选人列表
   * @return {Array}
   */
  async list() {
    let candidates = [];
    //获取候选人分值排序
    let rs = await CandidateRedis.list();

    for (let i = 0; i < rs.length; i++) {
      if (i % 2 == 0) {
        let candidate = await CandidateRedis.getOne(rs[i]);
        candidate.votes = rs[i + 1];
        candidates.push(candidate)
      }
    }
    return candidates;
  }
}

/**
 * 判断数组中是否含有重复字符串
 * @param {Array} cuidsArr 
 * @return {Boolean}
 */
function isDistinct(cuidsArr) {
  let obj = {};
  for (let i in cuidsArr) {
    let cuid = cuidsArr[i];
    if (obj[cuid]) {
      return false;
    }
    obj[cuid] = 1;
  }
  return true;
}

module.exports = new CandidateService();