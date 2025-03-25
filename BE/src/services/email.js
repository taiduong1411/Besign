const express = require("express");
const nodemailer = require("nodemailer");

module.exports = {
  randomCode: () => {
    const characters = "0123456789";
    function generateString(length) {
      var result = "";
      const charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    return generateString(6);
  },
  sendEmail: async (code, mail) => {
    async function autoSend(code, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"Besign. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: "Quên mật khẩu",
        text: code,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .code {
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 24px;
                            letter-spacing: 8px;
                            background-color: #f4f4f4;
                            border: 1px solid #dddddd;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Besign. Customer Support</h1>
                        </div>
                        <div class="content">
                            <h2>Mã xác thực của bạn</h2>
                            <div class="code">${code}</div>
                            <p>Đây là mã xác thực có hiệu lực trong 5 phút. Vui lòng không chia sẻ cho người khác !!</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 Besign. All rights reserved.</p>
                        </div>
                    </div>
                </body>              
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return autoSend(code, mail);
  },
  replyEmail: async (subject, message, mail) => {
    async function replyEmail(subject, message, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"Besign. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: left;
                        }
                        .message {
                            margin: 20px 0;
                            padding: 20px;
                            background-color: #f4f4f4;
                            border: 1px solid #dddddd;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Besign. Customer Support</h1>
                        </div>
                        <div class="content">
                            <h2>Dear Customer,</h2>
                            <p>Thank you for reaching out to us. Below is our response to your message:</p>
                            <div class="message">${message}</div>
                            <p>If you have any further questions or need additional assistance, please do not hesitate to contact us.</p>
                            <p>Best regards,</p>
                            <p>Besign. Customer Support Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 Besign. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return replyEmail(subject, message, mail);
  },
  confirmSeller: async (subject, message, mail) => {
    async function confirmSeller(subject, message, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"Besign. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f9fafb;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 650px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #4f46e5, #3b82f6);
                            padding: 30px 0;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 700;
                            letter-spacing: 0.5px;
                        }
                        .header-logo {
                            width: 70px;
                            height: 70px;
                            background-color: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 15px;
                            font-size: 32px;
                            font-weight: bold;
                            color: #4f46e5;
                        }
                        .success-icon {
                            font-size: 36px;
                            display: block;
                            margin: 20px auto;
                            text-align: center;
                            color: #10b981;
                        }
                        .content {
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #1f2937;
                            font-size: 24px;
                            margin-bottom: 20px;
                            font-weight: 600;
                        }
                        .message-box {
                            background-color: #f3f4f6;
                            border-radius: 12px;
                            padding: 25px;
                            margin: 20px 0;
                            text-align: left;
                            border-left: 5px solid #4f46e5;
                        }
                        .message-box p {
                            margin: 0;
                            line-height: 1.7;
                            color: #4b5563;
                        }
                        .next-steps {
                            background-color: #ecfdf5;
                            border-radius: 12px;
                            padding: 20px 25px;
                            margin: 30px 0;
                            text-align: left;
                        }
                        .next-steps h3 {
                            color: #10b981;
                            margin-top: 0;
                            font-size: 18px;
                        }
                        .next-steps ul {
                            padding-left: 20px;
                            margin-bottom: 0;
                        }
                        .next-steps li {
                            margin-bottom: 10px;
                            color: #374151;
                        }
                        .button {
                            display: inline-block;
                            background: linear-gradient(135deg, #4f46e5, #3b82f6);
                            color: white;
                            text-decoration: none;
                            padding: 12px 30px;
                            border-radius: 50px;
                            font-weight: 600;
                            margin: 25px 0;
                            transition: all 0.3s ease;
                        }
                        .button:hover {
                            background: linear-gradient(135deg, #4338ca, #2563eb);
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
                        }
                        .support {
                            margin-top: 30px;
                            color: #6b7280;
                            font-size: 15px;
                        }
                        .support a {
                            color: #4f46e5;
                            text-decoration: none;
                        }
                        .footer {
                            background-color: #f3f4f6;
                            padding: 20px;
                            text-align: center;
                            font-size: 14px;
                            color: #6b7280;
                            border-top: 1px solid #e5e7eb;
                        }
                        .social {
                            margin: 15px 0;
                        }
                        .social a {
                            display: inline-block;
                            margin: 0 10px;
                            color: #4b5563;
                            text-decoration: none;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="header-logo">B</div>
                            <h1>Besign. Customer Support</h1>
                        </div>
                        <div class="content">
                            <div class="success-icon">🎉</div>
                            <h2>Chúc mừng! Bạn đã trở thành người bán</h2>
                            <p>Tài khoản của bạn đã được phê duyệt thành công và bây giờ bạn có thể bắt đầu bán hàng trên Besign.</p>
                            
                            <div class="message-box">
                                <p>${message}</p>
                            </div>
                            
                            <div class="next-steps">
                                <h3>Các bước tiếp theo</h3>
                                <ul>
                                    <li>Đăng nhập vào tài khoản người bán của bạn</li>
                                    <li>Hoàn thiện thông tin cửa hàng và thương hiệu</li>
                                    <li>Bắt đầu đăng sản phẩm đầu tiên của bạn</li>
                                    <li>Thiết lập các phương thức thanh toán</li>
                                </ul>
                            </div>
                            
                            <a href="https://besign.vn/seller/dashboard" class="button">Truy cập cửa hàng của bạn</a>
                            
                            <p class="support">Cần trợ giúp? Liên hệ đội ngũ hỗ trợ của chúng tôi tại <a href="mailto:support@besign.vn">support@besign.vn</a></p>
                        </div>
                        <div class="footer">
                            <div class="social">
                                <a href="#">Facebook</a>
                                <a href="#">Instagram</a>
                                <a href="#">Twitter</a>
                            </div>
                            <p>&copy; 2023 Besign. Tất cả các quyền được bảo lưu.</p>
                        </div>
                    </div>
                </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return confirmSeller(subject, message, mail);
  },
  rejectSeller: async (subject, message, mail) => {
    async function rejectSeller(subject, message, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"Besign. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #1f2937;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .message-box {
                            background-color: #f3f4f6;
                            border-radius: 12px;
                            padding: 25px;
                            margin: 20px 0;
                            text-align: left;
                        }
                        .message-box p {
                            margin: 0;
                            line-height: 1.7;
                            color: #4b5563;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Besign. Customer Support</h1>
                        </div>
                        <div class="content">
                            <h2>Dear Customer,</h2>
                            <p>We regret to inform you that your account has been rejected due to the following reasons:</p>
                            <div class="message-box">
                                <p>${message}</p>
                            </div>
                            <p>If you have any questions or need further assistance, please contact our support team at <a href="mailto:support@besign.vn">support@besign.vn</a>.</p>
                            <p>Thank you for your understanding.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2023 Besign. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return rejectSeller(subject, message, mail);
  },
  blockSeller: async (subject, message, mail) => {
    async function blockSeller(subject, message, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"Besign. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #1f2937;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .message-box {
                            background-color: #f3f4f6;
                            border-radius: 12px;
                            padding: 25px;
                            margin: 20px 0;
                            text-align: left;
                        }
                        .message-box p {
                            margin: 0;
                            line-height: 1.7;
                            color: #4b5563;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Besign. Customer Support</h1>
                        </div>
                        <div class="content">
                            <h2>Dear Customer,</h2>
                            <p>We regret to inform you that your account has been blocked due to violating our terms of service. Here are the details:</p>  
                            <div class="message-box">
                                <p>${message}</p>
                            </div>
                            <p>If you have any questions or need further assistance, please contact our support team at <a href="mailto:support@besign.vn">support@besign.vn</a>.</p>
                            <p>Thank you for your understanding.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2023 Besign. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return blockSeller(subject, message, mail);
  },
};
