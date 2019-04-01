const config = require('../Configs');
const Promise = require('bluebird');
const mysql = Promise.promisifyAll(require('mysql'));
const Log = require('../Tools/Log');

let db_config = {
  connectionLimit: config.db.mysql.connectionLimit,
  host: config.db.mysql.host,
  port: config.db.mysql.port,
  user: config.db.mysql.user,
  password: config.db.mysql.password,
  database: config.db.mysql.database,
  charset: 'utf8mb4'
}
Log.info('MySQL连接信息..');
Log.info(db_config);

/**
 * 创建数据库连接池
 */
var pool = mysql.createPool(db_config)

module.exports = Promise.promisifyAll(pool);