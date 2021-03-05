const sgMail = require("@sendgrid/mail");


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "sourav2fly@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}.Let me know how you get along with the app.`,
  }).then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  });
};

const sendDeleteEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "sourav2fly@gmail.com",
    subject: "We will miss you",
    text: `Hello, ${name}.We are sorry we were not able to meet your requirements.Please let us know the reason where we lag behind so that we can improve`,
  }).then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  });
};

module.exports = {
  sendWelcomeEmail,
  sendDeleteEmail,
};
