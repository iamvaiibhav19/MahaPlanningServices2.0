const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a pdf
  // 2) Send email

  const transporter = nodeMailer.createTransport({
    type: "SMTP",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    type: "SMTP",
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL, //SMPT stands for Simple Mail Transfer Protocol
      pass: "fdcrouzgpqpwkilj",
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    attachments: [
      {
        filename: "test.pdf",
        path: options.pdf,
      },
    ],
  };

  console.log(options);
  console.log(options.message);

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
