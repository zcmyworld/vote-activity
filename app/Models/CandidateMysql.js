let Pool = require('./Pool');

class CandidateMysql {
  /**
   * 添加候选人
   * @param {String} name 候选人名字
   * @param {String} info 候选人信息
   * @param {Int} createdAt 创建时间
   * @return {Int} insertId 数据key id
   */
  async create(name, info, createdAt) {
    let sql = "insert va_candidates (name, info, createdAt) values (?,?,?)";
    let args = [name, info, createdAt];
    let rs = await Pool.queryAsync(sql, args);
    if (!rs.insertId) {
      return false;
    }
    return rs.insertId;
  }

  /**
   * 修改候选人信息
   * @param {Int} cuid 候选人id
   * @param {String} name 候选人名字
   * @param {String} info 候选人信息 
   * @return {boolean}
   */
  async update(cuid, name, info) {
    let sql = "update va_candidates set name=?, info=? where id=?";
    let args = [name, info, cuid];
    let rs = await Pool.queryAsync(sql, args);
    if (rs.affectedRows == 0) {
      return false;
    }
    return true;
  }


  /**
   * 删除候选人
   * @param {String} cuid
   * @return {boolean}
   */
  async drop(cuid) {
    let sql = "delete from va_candidates where id = ?"
    let args = [cuid];
    let rs = await Pool.queryAsync(sql, args);
    if (rs.affectedRows == 0) {
      return false;
    }
    return true;
  }
}

module.exports = new CandidateMysql();
