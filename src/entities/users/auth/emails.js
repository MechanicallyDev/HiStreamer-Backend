const nodemailer = require('nodemailer');

async function EmailConfigHandler() {
  if (process.env.NODE_ENV === 'production') {
    return {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASSWORD,
      },
      secure: true,
    };
  } else {
    const testAccount = nodemailer.createTestAccount();
    return {
      host: 'smtp.ethereal.email',
      auth: await testAccount,
      tls: { rejectUnauthorized: false },
    };
  }
}

class Email {
  async sendMail(user) {
    const emailConfig = await EmailConfigHandler();
    const transporter = nodemailer.createTransport(emailConfig);
    const info = await transporter.sendMail(this);
    console.log(`URL: `, nodemailer.getTestMessageUrl(info));
  }
}

class VerificationEmail extends Email {
  constructor(user, link) {
    super();
    this.from = '"HiStreamer" <noreply@histreamer.com>';
    this.to = user.email;
    this.subject = 'Email verification';
    this.text = `Hi Streamer! You're receiving this message because this email address was recently used to create an account on HiStreamer.com. 
To verify you own this email, please open the followinig link: 
${link}`;
    this.html = `<h1>Hi Streamer!</h1>
    <p>You're receiving this message because this email address was recently 
    used to create an account on 
    <a href="https://www.histreamer.com">HiStreamer.com</a>.</p>
    <p>To verify you own this email, please open the followinig link:</p> 
    <p><a href="${link}">Confirm this e-mail</a></p>`;
  }
}
module.exports = { VerificationEmail };
