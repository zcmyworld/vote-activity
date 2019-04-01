const redis = require('redis');
const Promise = require("bluebird");
const bluebird = require('bluebird');
const Log = require('../Tools/Log');
const config = require('../Configs');


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


let db_config = {
  port: config.db.redis.port,
  host: config.db.redis.host,
  password: config.db.redis.password ? config.db.redis.password : ''
}
Log.info("Redis 连接信息..");
Log.info(db_config);

class Redis {
  constructor() {
    this.redisClient = redis.createClient(db_config);
    this.redisClient.on("error", function (err) {
      console.log(err);
    });
  }

  /**
   * 获取Redis连接
   */
  getClient() {
    return this.redisClient;
  }
}

module.exports = new Redis();