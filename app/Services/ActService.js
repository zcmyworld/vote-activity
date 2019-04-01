const AdminRedis = require('../Models/AdminRedis');

class ActService {
  /*
   * 判断当前是否为活动时间
   * @Return boolean
   */
  async isActStart() {
    let { startTime, endTime } = await AdminRedis.getActTime();
    let now = new Date().getTime();
    if (now > startTime && now < endTime) {
      return true;
    }
    return false;
  }
}

module.exports = new ActService();