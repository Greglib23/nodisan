import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import * as fs from 'fs'
dotenv.config();

const readHtmlFile = async (path: string): Promise<string> => {
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

const sendMail = async (from: string, to: string, subject: string, textToSend: string) => {
    if (from && to && subject) {
        // Create an SMTP transporter using your SMTP details of your email providor
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
            secure: true, // Uses TLS
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        // Define the email options
        interface MailOptions {
            from: string;
            to: string;
            subject: string;
            [key: string]: any;
        }

        // Define the content of the email
        let mailOptions: MailOptions = {
            from: from,
            to: to,
            subject: subject,
        };


        if (textToSend) {
            mailOptions.text = textToSend
        } else {
            const htmlContent = readHtmlFile('./src/mail/{ emailName }.html')
            // Define the content of the email
            mailOptions.html = htmlContent
        }


        // Envía el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sended:', info.response);
            }
        });
    } else {
        if (!from) {
            console.error('From is required');
            return
        }
        if (!to) {
            console.error('To is required');
            return
        }
        if (!subject) {
            console.error('Subject is required');
            return
        }
    }

}
export default sendMail

