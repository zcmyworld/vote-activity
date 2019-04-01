/**
 * 定时任务，将用户投票的信息从 Redis 队列同步到 MySQl
 */
const Redis = require('../Models/Redis');
const co = require("co");
const Pool = require('../Models/Pool');

class VotesCron {
  constructor() {
    //投票人队列
    this.userVoteListKey = "votesinfo";

    //投票人信息
    this.userVoteHashPrefixKey = "voted:";

    //获取Redis连接
    this.redisClient = Redis.getClient();
  }
  async exec() {
    let uid = await this.redisClient.lindexAsync(this.userVoteListKey, 0);

    //队列为空
    if (!uid) {
      return;
    }

    //获取投票人信息
    let voteInfo = await this.redisClient.hgetallAsync(`${this.userVoteHashPrefixKey}${uid}`);

    //将投票信息入库
    try {
      let cuids = voteInfo.cuids;
      let cuidsArr = cuids.split(',');
      for (let i in cuidsArr) {
        let cuid = cuidsArr[i];
        let sql = "insert va_votes (cuid, uid, createdAt )values (?,?,?)";
        let args = [cuid, uid, new Date().getTime()];
        await Pool.queryAsync(sql, args);
      }
    } catch (e) {
      //存库遇到错误，终止函数  
      return;
    }

    //如果插入过程没有出错，删除队列中的这个数据
    await this.redisClient.lpopAsync(this.userVoteListKey);
  }
}

co(async function () {
  await new VotesCron().exec();
})