const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  //create email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //Options for sending email
  const options = {
    from: sent_from,
    to: send_to,
    reply: reply_to,
    subject: subject,
    html: message,
  };

  //send the email
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    }
  });
};

module.exports = sendEmail;
