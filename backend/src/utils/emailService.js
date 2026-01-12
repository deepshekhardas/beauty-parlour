import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter
// For "perfect" backend, we typically use SendGrid or similar in prod
// But standard SMTP is fine for this scope.
// If env vars are missing, we log to console (Dev mode).

const createTransporter = () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    return null;
};

const sendEmail = async (to, subject, text, html) => {
    const transporter = createTransporter();

    if (transporter) {
        try {
            const info = await transporter.sendMail({
                from: `"${process.env.SMTP_FROM_NAME || 'Glow & Grace'}" <${process.env.SMTP_FROM_EMAIL || 'no-reply@example.com'}>`, // sender address
                to,
                subject,
                text,
                html,
            });
            console.log('Message sent: %s', info.messageId);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    } else {
        // Fallback logging
        // Fallback logging for Development
        console.log('--- MOCK EMAIL SENDER ---');
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            to,
            subject,
            bodyPreview: text ? text.substring(0, 50) + '...' : 'HTML Content',
            mode: 'DEV_MOCK'
        }, null, 2));
        console.log('-------------------------');
        return true;
    }
};

export default sendEmail;
