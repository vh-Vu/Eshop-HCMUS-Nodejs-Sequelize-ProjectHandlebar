require("dotenv").config();
const nodemailer = require('nodemailer');


async function sendForgotPasswordMail(user, host, resetLink) {
  let transporter = nodemailer.createTransport({
    host: process.env.SES_SMTP_HOST || 'email-smtp.ap-southeast-2.amazonaws.com',
    port: 587,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  let mailOptions = {
    from: '"EShop" <ptudw23880104@hotmail.com>',
    to: `"${user.firstName} ${user.lastName}" <${user.email}>`,
    subject: '[Eshop] Reset Password!',
    text: `Dear ${user.firstName} ${user.lastName}, welcome to EShop! There was a request to change your password! If you did not make this request, please ignore this email. Otherwise, please click this link to change your password: ${resetLink}`,
    html: `
      Hi ${user.firstName} ${user.lastName},<br/>
      There was a request to change your password!<br/>
      If you did not make this request, please ignore this email.<br/>
      Otherwise, please click this link to change your password: <a href="${resetLink}">${resetLink}</a>`
  };

  try {
    let result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.response);
    return { success: true, message: 'Email sent successfully', result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
}

module.exports = {sendForgotPasswordMail};


// function sendForgotPasswordMail (user,host,resetLink){


//     let transporter = nodemailer.createTransport({
//   host: 'smtp-pulse.com',
//   port: 2525,
//   auth: {
//     user: 'ptudw23880104@hotmail.com',
//     pass: '02c37aa93d1c5c2f187e3c3cc6341922'
//   }
// });

// let mailOptions = {
//   from: 'ptudw23880104@hotmail.com',
//   to: user.email,
//   subject: "[Eshop] Reset Password !",
//   html: `Hi ${user.firstName} ${user.lastName},
//         <br/>
//         There was a request to change your password!    
//         <br/>
//         If you did not make this request then please ignore this email.
//         <br/>
//         Otherwise, please click this link to change your password: ${resetLink}`
// };
// try {
//     let info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.response);
//     return { success: true, message: 'Email sent successfully', info };
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return { success: false, message: 'Failed to send email', error };
//   }
//     return transporter;
// }





// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) return console.error('Error:', error);
//   console.log('Email sent:', info.response);
// });

//     const mailjet = mailJet.apiConnect(
//     process.env.MJ_APIKEY_PUBLIC,
//     process.env.MJ_APIKEY_PRIVATE,
// );

// const request = mailjet
//         .post('send', { version: 'v3.1' })
//         .request({
//           Messages: [
//             {
//               From: {
//                 Email: "ptudw23880104@hotmail.com",
//                 Name: "EShop"
//               },
//               To: [
//                 {
//                   Email: user.email,
//                   Name: `${user.firstName} ${user.lastName}`
//                 }
//               ],
//               Subject: "[Eshop] Reset Password !",
//               TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
//               HTMLPart: `
//                         Hi ${user.firstName} ${user.lastName},
//                         <br/>
//                         There was a request to change your password!    
//                         <br/>
//                         If you did not make this request then please ignore this email.
//                         <br/>
//                         Otherwise, please click this link to change your password: ${resetLink}`
//             }
//           ]
//         })

// request
//     .then((result) => {
//         console.log(result.body)
//     })
//     .catch((err) => {
//         console.log(err.statusCode)
//     })

//module.exports = {sendForgotPasswordMail};