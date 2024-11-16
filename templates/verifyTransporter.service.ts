import nodemailer from 'nodemailer';
const verifyTransporter = async () => {
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
    transporter.verify(function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });
}
export default verifyTransporter