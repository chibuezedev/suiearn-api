const sgMail = require("@sendgrid/mail");
const config = require("../configs/env");

sgMail.setApiKey(config.sendgrid.apiKey);

const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      from: config.sendgrid.senderEmail,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = {
  sendEmail,
};
