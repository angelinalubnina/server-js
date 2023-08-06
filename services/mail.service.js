const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: process.env.SMTP_HOST,
            post: process.env.SMTP_PORT,
            secure: false, // почитать про это подробнее
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    async sendActivationEmail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USERNAME,
            to,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
        });
    }
}

module.exports = new MailService();
