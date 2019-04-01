

module.exports = {
  email: {
    host: 'smtp.exmail.qq.com',
    email: process.env.SYS_SENDEMAIL,
    password: process.env.SYS_SENDEMAILPWD
  },
  host: process.env.SYS_HOST,
  admin: {
    // 配置多个管理员账号
    emails: ["admin@qq.qq", "admin@qq.qq"]
  }
}