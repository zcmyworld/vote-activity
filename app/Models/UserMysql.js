
const Pool = require('./Pool');

const UNANCTIVE = -1;// 未激活状态
const ACTIVE = 1; // 激活状态

class UserMysql {

  /**
   * 根据邮箱返回用户信息
   * @param {String} email 用户邮箱
   * @return {Object} user 用户信息
   */
  async getUserByEmail(email) {
    let sql = "select id,email,password,isActive from va_users where email=?";
    let args = [email];
    let rs = await Pool.queryAsync(sql, args);
    if (rs.length == 0) {
      return null;
    }
    return rs[0];
  }

  /**
   * 创建新用户,默为未激活状态
   * @param {String} email 用户邮箱
   * @param {String} md5_password 用户加密后的密码
   * @return {Int} insertId
   */
  async create(email, md5_password) {
    let sql = "insert va_users (email, password, isActive, createdAt) values (?,?,?,?)";
    let args = [email, md5_password, UNANCTIVE, new Date().getTime()];
    let rs = await Pool.queryAsync(sql, args);
    if (!rs.insertId) {
      return false;
    }
    return rs.insertId;
  }


  /**
   * 激活用户
   * @param {String} email 用户邮箱
   * @return {Boolean}
   */
  async active(email) {
    let sql = "update va_users set isActive=? where email =?";
    let args = [ACTIVE, email];
    let rs = await Pool.queryAsync(sql, args);
    if (rs.affectedRows == 0) {
      return false;
    }
    return true;
  }
}

module.exports = new UserMysql();