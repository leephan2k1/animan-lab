const nodemailer = require("nodemailer");
const { nanoid } = require("nanoid");
const logEvents = require("../helper/logEvents");

const sendMail = (userEmail, token) => {
  const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "animanlab@server.com",
    to: userEmail,
    subject: "Đây là đường dẫn đặt lại mật khẩu Animan Lab của bạn:",
    html:
      '<p>Không chia sẻ đường dẫn này với bất kỳ ai khác, đường dẫn chỉ có hiệu lực trong 10 phút! vào đây: <a href="http://localhost:8080/reset-password?token=' +
      token +
      '">link</a> để đặt lại mật khẩu</p>',
  };

  mailer.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Mail Service:: ", error);
      logEvents(`id:${nanoid(5)} --- mail service --- ${error}`);
      return false;
    } else {
      console.log("Mail Service:: ", info.response);
      logEvents(`id:${nanoid(5)} --- mail service --- ${info.response}`);
      return true;
    }
  });
};

module.exports = sendMail;
