const Redis = require('./Redis');

class AdminRedis {

  constructor() {
    //记录活动时间的 hash key
    this.actTimeHashKey = "acttime";

    //获取Redis连接
    this.redisClient = Redis.getClient();
  }

  /**
   * 设置活动开始和结束时间
   * @param {String} startTime
   * @param {String} endTime
   * @Return {boolean}
   */
  async setActTime(startTime, endTime) {
    let rs = await this.redisClient.hmsetAsync(this.actTimeHashKey, {
      startTime: startTime,
      endTime: endTime
    })
    if (rs != "OK") {
      return false;
    }
    return true;
  }


  /**
   * 获取活动开始和结束时间
   * @Return {Object}
   */
  async getActTime() {
    let rs = await this.redisClient.hgetallAsync(this.actTimeHashKey);
    if (!rs) {
      return {
        startTime: "",
        endTime: ""
      };
    }
    return rs;
  }
}

module.exports = new AdminRedis();