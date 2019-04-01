const config = require('../Configs');
const nodemailer = require('nodemailer');

class EmailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.system.email.host,
      auth: {
        user: config.system.email.email,
        pass: config.system.email.password
      }
    });
  }

  /**
   * 发送邮件
   * @param {String} title 邮件标题
   * @param {String} content 邮件HTML内容
   * @param {String} reciver 收件人邮箱
   */
  sendEmail(title, content, reciver) {
    let mailOptions = {
      from: config.system.email.email,
      to: reciver,
      subject: title,
      html: content
    };
    // this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();

