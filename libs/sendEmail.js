
const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
const awsconfig = require("../config/awsconfig");
const ejs = require('ejs')
module.exports = async function sendEmail(data) {
  try {
    const transporter = nodemailer.createTransport({
      SES: new AWS.SES({
        apiVersion: '2012-10-17',
        accessKeyId: awsconfig.accessKeyId,
        secretAccessKey: awsconfig.secretAccessKey,
        region: awsconfig.region,
      }),
    });
    let contents = await ejs.renderFile(__dirname + '/verifyEmailTemplate.ejs', { content:data.content, firstName: data.firstName });
    await transporter.sendMail({
      from: awsconfig.emailSender,
      to: data.email,
      subject: '[Singular Cure] please verify your application',
      html: contents,
    });
  } catch (err) {
    console.log("sendEmail", err.message);
    return err.message
  }
};



