import nodemailer from 'nodemailer';

import mailerConfig from '../../Configs/mailler.config';
import { IUser } from '../Types/type';

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: mailerConfig.email.service,
  auth: {
    user: mailerConfig.email.user,
    pass: mailerConfig.email.password,
  },
});

// Hàm gửi email thông báo cho người dùng
const sendRegistrationEmail = async (user: IUser) => {
  const { fullname, email } = user;
  // Nội dung email
  const mailOptions = {
    from: mailerConfig.email.user,
    to: email,
    subject: 'Registration Successful',
    html: `
      <html>
        <head>
        <style>
        /* CSS styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .infoTwitter {
          display: flex;
          align-items: center;
          color: #1da1f2;
          margin-bottom: 20px;
        }
        .infoTwitter img {
          width: 80px;
          height: auto;
          object-fit: cover;
        }
        .infoTwitter h3 {
          font-size: 24px;
          margin: 0;
        }
        h1 {
          color: #333333;
          margin: 0;
        }
        .content {
          color: #555555;
          font-size: 18px;
        }
      </style>
        </head>
        <body>
        <div class="container">
        <div class="infoTwitter">
         <img src="https://png.pngtree.com/png-clipart/20221019/original/pngtree-twitter-social-media-round-icon-png-image_8704823.png" />
          <h3>Twitter</h3>
        </div>
        <h1>Chúc mừng ${fullname} đã đăng ký thành công!</h1>
        <p class="content">Hãy khám phá chúng tôi và trải nghiệm những điều thú vị.</p>
      </div>
        </body>
      </html>
    `,
  };

  // Gửi email
  await transporter.sendMail(mailOptions);
};

export default sendRegistrationEmail;
