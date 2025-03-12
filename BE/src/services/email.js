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
};
