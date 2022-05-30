const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");
const htmlToText = require("html-to-text");
const juice = require("juice");

const mail = async (props) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "nikhil.mobilefirst@gmail.com", // generated ethereal user
      pass: "Password@12", // generated ethereal password
    },
  });

  const htmlBody = template(props);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"DAAM 🚀" <nikhil.mobilefirst@gmail.com>', // sender address
    to: props.email, // list of receivers
    bcc: "riddhi.mobilefirst@gmail.com, nikhil.mobilefirst@gmail.com",
    subject: props.subject || "DAAM signup verification 👻", // Subject line
    // text: "Hello world?", // plain text body
    html: htmlBody,
  });

  // console.log("Message sent: %s", info);
  return info;
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

const template = (data) => {
  const templatePath = data.template;
  if (fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, { name: "blabla bla", ...data });
    const text = htmlToText.htmlToText(html);
    const htmlWithStylesInlined = juice(html);

    return htmlWithStylesInlined;
    // options.text = text;
  }
};
module.exports = {
  mail,
};
