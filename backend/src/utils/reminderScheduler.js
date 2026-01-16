/**
 * Appointment Reminder Scheduler
 * Sends WhatsApp reminders 1 day before appointments
 * 
 * Run this as a cron job or scheduled task
 * Usage: node src/utils/reminderScheduler.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from '../models/Appointment.js';
import { sendAppointmentReminder } from './whatsappService.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Reminder Scheduler');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

/**
 * Get tomorrow's date in YYYY-MM-DD format
 */
const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};

/**
 * Send reminders for appointments scheduled for tomorrow
 */
const sendDailyReminders = async () => {
    console.log('📅 Starting daily reminder job...');
    const tomorrowDate = getTomorrowDate();
    console.log(`Looking for appointments on: ${tomorrowDate}`);

    try {
        // Find all confirmed appointments for tomorrow
        const appointments = await Appointment.find({
            date: tomorrowDate,
            status: 'CONFIRMED',
            reminder_sent: { $ne: true } // Don't send duplicate reminders
        });

        console.log(`Found ${appointments.length} appointments to remind`);

        let successCount = 0;
        let failCount = 0;

        for (const appointment of appointments) {
            if (appointment.customer_phone) {
                const result = await sendAppointmentReminder(
                    appointment.customer_phone,
                    appointment.customer_name,
                    appointment.service_snapshot?.name || 'Service',
                    appointment.date,
                    appointment.time_slot
                );

                if (result.success) {
                    // Mark reminder as sent
                    appointment.reminder_sent = true;
                    await appointment.save();
                    successCount++;
                    console.log(`✅ Reminder sent to ${appointment.customer_name}`);
                } else {
                    failCount++;
                    console.log(`❌ Failed for ${appointment.customer_name}: ${result.error}`);
                }
            }
        }

        console.log(`\n📊 Reminder Summary:`);
        console.log(`   ✅ Sent: ${successCount}`);
        console.log(`   ❌ Failed: ${failCount}`);

    } catch (error) {
        console.error('Error sending reminders:', error);
    }
};

/**
 * Main execution
 */
const run = async () => {
    await connectDB();
    await sendDailyReminders();

    // Close connection after job completes
    await mongoose.connection.close();
    console.log('✨ Reminder job completed');
    process.exit(0);
};

// Run the scheduler
run();
