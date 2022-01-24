const nodemailer = require('nodemailer');

class EmailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }

        })
    }

    async sendActivationEmail(email , link){
        await this.transporter.sendMail({
            from : process.env.SMTP_USER,
            to: email,
            subject: 'Activation of account ' + process.env.API_URL,
            text: '',
            html: 
                `
                <div>
                    <h1>To activate your account you need to go by this link</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }
}

module.exports = new EmailService();