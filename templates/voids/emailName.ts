import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import * as fs from 'fs'
dotenv.config();

const readHtmlFile = async (path: string): string => {
    let data: string = await new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    return data
};

const htmlContent = readHtmlFile('./src/mail/{ emailName }.html')


const sendMail = async (from: string, to: string, subject: string, text: string) => {
    // Create an SMTP transporter using your SMTP details of your email providor
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        secure: false, // Uses TLS
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Define the content of the email
    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: htmlContent,
    };

    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sended:', info.response);
        }
    });
}
export default sendMail

