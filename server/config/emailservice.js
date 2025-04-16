const nodemailer = require('nodemailer');

const sendEmail = (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,      
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD  
    }
  });

  const emailOptions = {
    from: 'Recipiece Support <support@recipiece.com>',
    to: option.email,
    subject: option.subject,
    text: option.message
  };

  return transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
