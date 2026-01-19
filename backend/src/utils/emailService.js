import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Email Service for Glow & Grace Beauty Parlour
 * Supports: Gmail, Outlook/Hotmail, Custom SMTP, or Ethereal (test mode)
 */

// Create transporter based on configuration
const createTransporter = async () => {
    // If SMTP credentials are configured, use them
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    // Gmail Configuration
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
            },
        });
    }

    // Outlook/Hotmail Configuration
    if (process.env.OUTLOOK_USER && process.env.OUTLOOK_PASS) {
        return nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.OUTLOOK_USER,
                pass: process.env.OUTLOOK_PASS,
            },
        });
    }

    // Development Mode: Use Ethereal (fake SMTP for testing)
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        try {
            const testAccount = await nodemailer.createTestAccount();
            console.log('📧 Ethereal Test Email Account Created');
            console.log('   - User:', testAccount.user);
            console.log('   - Preview URL: https://ethereal.email/login');

            return nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        } catch (error) {
            console.log('⚠️ Could not create Ethereal account, falling back to console logging');
            return null;
        }
    }

    return null;
};

// Cache transporter to avoid recreating
let cachedTransporter = null;

const getTransporter = async () => {
    if (!cachedTransporter) {
        cachedTransporter = await createTransporter();
    }
    return cachedTransporter;
};

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (optional)
 * @returns {Promise<{success: boolean, messageId?: string, previewUrl?: string}>}
 */
const sendEmail = async (to, subject, text, html) => {
    const transporter = await getTransporter();

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Glow & Grace Beauty Parlour'}" <${process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'no-reply@glowandgrace.com'}>`,
        to,
        subject,
        text,
        html: html || text,
    };

    if (transporter) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully!');
            console.log('   - Message ID:', info.messageId);

            // If using Ethereal, provide preview URL
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                console.log('   - Preview URL:', previewUrl);
            }

            return {
                success: true,
                messageId: info.messageId,
                previewUrl: previewUrl || null
            };
        } catch (error) {
            console.error('❌ Error sending email:', error.message);
            return { success: false, error: error.message };
        }
    } else {
        // Fallback: Console logging for development
        console.log('\n📧 ═══════════════════════════════════════════════');
        console.log('   MOCK EMAIL (No SMTP configured)');
        console.log('═══════════════════════════════════════════════════');
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Body Preview: ${text ? text.substring(0, 100) + '...' : 'HTML Content'}`);
        console.log('═══════════════════════════════════════════════════\n');
        return { success: true, mock: true };
    }
};

/**
 * Send appointment confirmation email
 */
const sendAppointmentConfirmation = async (userEmail, appointmentDetails) => {
    const { serviceName, staffName, date, time, totalPrice } = appointmentDetails;

    const subject = '✨ Appointment Confirmed - Glow & Grace';
    const text = `Your appointment for ${serviceName} with ${staffName} on ${date} at ${time} has been confirmed. Total: ₹${totalPrice}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">✨ Glow & Grace</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #333;">Appointment Confirmed!</h2>
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #764ba2;">
                    <p><strong>Service:</strong> ${serviceName}</p>
                    <p><strong>Stylist:</strong> ${staffName}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Total:</strong> ₹${totalPrice}</p>
                </div>
                <p style="margin-top: 20px; color: #666;">We look forward to seeing you!</p>
            </div>
            <div style="background: #333; color: #999; padding: 15px; text-align: center; font-size: 12px;">
                © ${new Date().getFullYear()} Glow & Grace Beauty Parlour
            </div>
        </div>
    `;

    return sendEmail(userEmail, subject, text, html);
};

/**
 * Send appointment reminder email
 */
const sendAppointmentReminder = async (userEmail, appointmentDetails) => {
    const { serviceName, staffName, date, time } = appointmentDetails;

    const subject = '⏰ Reminder: Your Appointment Tomorrow - Glow & Grace';
    const text = `Reminder: Your ${serviceName} appointment with ${staffName} is scheduled for ${date} at ${time}. See you soon!`;

    return sendEmail(userEmail, subject, text);
};

export default sendEmail;
export { sendAppointmentConfirmation, sendAppointmentReminder };

