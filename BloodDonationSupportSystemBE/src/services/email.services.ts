import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmailService = async (email: string, subject: string, htmlContent: string) => {
    try {
        console.log('Sending email to:', email);
        console.log('Using EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
        
        if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
            throw new Error('Email credentials not configured');
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `"Đại Việt Blood" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: subject, 
            html: htmlContent, 
        });

        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error: any) {
        console.error("Error in sendEmailService:", error.message);
        console.error("Error details:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};