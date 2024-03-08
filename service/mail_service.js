const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }
  async sendActivationMail(toEmail, link) {
    console.log("3");
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "ITINFO akkauntini faollashtirish",
      text: "",
      html: `
            <div>
                <h1> Akkauntni faollashtirish uchun quyidagi linkni bosing </h1>
                <a href=${link}> FAOLLASHTIRISH </a>
            </div>
        `,
    });
  }
}

module.exports = new MailService();
