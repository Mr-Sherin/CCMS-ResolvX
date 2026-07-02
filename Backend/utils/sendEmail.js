const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // Use Ethereal for dummy emails during development
  if (process.env.USE_DUMMY_EMAIL === 'true') {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Define the email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'CCMS Admin'} <${process.env.FROM_EMAIL || 'admin@ccms.local'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);

  if (process.env.USE_DUMMY_EMAIL === 'true') {
    console.log('Dummy Email sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
