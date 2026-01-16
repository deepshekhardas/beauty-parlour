/**
 * WhatsApp Business API Service
 * Uses Meta Cloud API for sending appointment notifications
 * 
 * Setup Required:
 * 1. Create Meta Business Account
 * 2. Add WhatsApp Business API product
 * 3. Get Phone Number ID and Access Token
 * 4. Create message templates (requires Meta approval)
 */

import dotenv from 'dotenv';
dotenv.config();

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Send WhatsApp message using Meta Cloud API
 * @param {string} to - Recipient phone number with country code (e.g., 919999999999)
 * @param {object} template - Template name and parameters
 */
const sendWhatsAppMessage = async (to, templateName, templateParams = []) => {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        console.log('--- MOCK WHATSAPP SENDER ---');
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            to,
            template: templateName,
            params: templateParams,
            mode: 'DEV_MOCK'
        }, null, 2));
        console.log('----------------------------');
        return { success: true, mock: true };
    }

    try {
        const response = await fetch(`${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to.replace(/\D/g, ''), // Remove non-digits
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'en' },
                    components: templateParams.length > 0 ? [{
                        type: 'body',
                        parameters: templateParams.map(text => ({ type: 'text', text }))
                    }] : []
                }
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('WhatsApp message sent:', data.messages?.[0]?.id);
            return { success: true, messageId: data.messages?.[0]?.id };
        } else {
            console.error('WhatsApp API Error:', data);
            return { success: false, error: data.error?.message };
        }
    } catch (error) {
        console.error('WhatsApp Send Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send booking confirmation message
 * Template: booking_confirmation
 * Parameters: [customer_name, service_name, date, time]
 */
const sendBookingConfirmation = async (phone, customerName, serviceName, date, time) => {
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return await sendWhatsAppMessage(
        phone,
        'booking_confirmation',
        [customerName, serviceName, formattedDate, time]
    );
};

/**
 * Send appointment reminder (1 day before)
 * Template: appointment_reminder
 * Parameters: [customer_name, service_name, date, time]
 */
const sendAppointmentReminder = async (phone, customerName, serviceName, date, time) => {
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return await sendWhatsAppMessage(
        phone,
        'appointment_reminder',
        [customerName, serviceName, formattedDate, time]
    );
};

/**
 * Send payment confirmation
 * Template: payment_success
 * Parameters: [customer_name, amount, transaction_id]
 */
const sendPaymentConfirmation = async (phone, customerName, amount, transactionId) => {
    return await sendWhatsAppMessage(
        phone,
        'payment_success',
        [customerName, `₹${amount}`, transactionId]
    );
};

/**
 * Send simple text message (for testing - requires 24hr window)
 */
const sendTextMessage = async (to, message) => {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        console.log('--- MOCK WHATSAPP TEXT ---');
        console.log(`To: ${to}`);
        console.log(`Message: ${message}`);
        console.log('--------------------------');
        return { success: true, mock: true };
    }

    try {
        const response = await fetch(`${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to.replace(/\D/g, ''),
                type: 'text',
                text: { body: message }
            })
        });

        const data = await response.json();
        return response.ok
            ? { success: true, messageId: data.messages?.[0]?.id }
            : { success: false, error: data.error?.message };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export {
    sendWhatsAppMessage,
    sendBookingConfirmation,
    sendAppointmentReminder,
    sendPaymentConfirmation,
    sendTextMessage
};
