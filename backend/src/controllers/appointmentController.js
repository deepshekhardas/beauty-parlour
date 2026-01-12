import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';
import sendEmail from '../utils/emailService.js';
import Joi from 'joi';

// Validation schema
const appointmentSchema = Joi.object({
    customer_name: Joi.string().required(),
    customer_phone: Joi.string().required(),
    customer_email: Joi.string().email().required(),
    service_id: Joi.string().required(),
    date: Joi.string().required(), // YYYY-MM-DD
    time_slot: Joi.string().required(), // "10:00-11:00"
    notes: Joi.string().allow(''),
    staff_id: Joi.string().allow('').optional(),
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = asyncHandler(async (req, res) => {
    const { error } = appointmentSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { customer_name, customer_phone, customer_email, service_id, date, time_slot, notes, staff_id } = req.body;

    // Check availability
    // If staff is selected, check specifically for that staff's availability
    let conflictQuery = { date, time_slot, status: { $ne: 'CANCELLED' } };
    if (staff_id) {
        // Logic: If a staff is chosen, they can't be double booked.
        // But standard logic (one appt per slot) might still hold if parlour is small.
        // We will enforce strict slot checking for now regardless of staff.
    }

    const existingAppointment = await Appointment.findOne(conflictQuery);
    if (existingAppointment) {
        res.status(400);
        throw new Error('Time slot already booked');
    }

    const service = await Service.findById(service_id);
    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    const appointment = await Appointment.create({
        customer_name,
        customer_phone,
        customer_email,
        service_id,
        staff_id: staff_id || null,
        service_snapshot: {
            name: service.name,
            price: service.base_price
        },
        date,
        time_slot,
        notes,
        status: 'PENDING'
    });

    // Send Email Notification
    const emailSubject = 'Provisional Booking - Glow & Grace';
    const emailBody = `Dear ${customer_name},\n\nYour appointment for ${service.name} on ${date} at ${time_slot} is successfully booked and PENDING confirmation.\n\nWe will notify you once it is confirmed.\n\nThank you,\nGlow & Grace`;
    const emailHtml = `<p>Dear ${customer_name},</p><p>Your appointment for <b>${service.name}</b> on <b>${date}</b> at <b>${time_slot}</b> is successfully booked and <b>PENDING</b> confirmation.</p><p>We will notify you once it is confirmed.</p><p>Thank you,<br>Glow & Grace</p>`;

    // Send to Customer
    await sendEmail(customer_email, emailSubject, emailBody, emailHtml);

    // Send to Admin
    await sendEmail(process.env.ADMIN_EMAIL || 'admin@example.com', 'New Appointment Booking', `New appointment from ${customer_name}`, `<p>New appointment: <b>${customer_name}</b> (${customer_email}) for <b>${service.name}</b> on ${date} at ${time_slot}</p>`);

    // In a real app we'd ask for customer email, but using fake one or param if available
    // console.log(`New booking from ${customer_name} on ${date} ${time_slot}`);

    res.status(201).json(appointment);
});

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = asyncHandler(async (req, res) => {
    const { date, status } = req.query;
    let query = {};

    if (date) {
        query.date = date;
    }
    if (status) {
        query.status = status;
    }

    const appointments = await Appointment.find(query).populate('service_id', 'name duration_minutes').sort({ date: 1, time_slot: 1 });
    res.json(appointments);
});

// @desc    Update appointment status/reschedule
// @route   PUT /api/appointments/:id
// @access  Private/Admin
const updateAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    const { status, date, time_slot } = req.body;

    // If rescheduling, check availability
    if ((date && date !== appointment.date) || (time_slot && time_slot !== appointment.time_slot)) {
        const checkDate = date || appointment.date;
        const checkSlot = time_slot || appointment.time_slot;

        const existing = await Appointment.findOne({
            date: checkDate,
            time_slot: checkSlot,
            status: { $ne: 'CANCELLED' },
            _id: { $ne: appointment._id } // exclude current
        });

        if (existing) {
            res.status(400);
            throw new Error('Target slot is already booked');
        }

        appointment.date = checkDate;
        appointment.time_slot = checkSlot;
    }

    if (status) {
        appointment.status = status;

        // Send Email Notification for Status Change
        if (['CONFIRMED', 'CANCELLED'].includes(status) && appointment.customer_email) {
            const subject = `Appointment ${status} - Glow & Grace`;
            let body = `Dear ${appointment.customer_name},\n\nYour appointment (ID: ${appointment._id}) has been ${status}.\n\n`;
            if (status === 'CONFIRMED') {
                body += `Please arrive 5 minutes early. We look forward to seeing you!\n`;
            } else {
                body += `We are sorry for the inconvenience. Please contact us to reschedule.\n`;
            }
            body += `\nThank you,\nGlow & Grace`;

            await sendEmail(appointment.customer_email, subject, body, `<p>${body.replace(/\n/g, '<br>')}</p>`);
        }

        console.log(`Appointment ${appointment._id} marked as ${status}`);
    }

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
});

// @desc    Get Analytics
// @route   GET /api/appointments/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
    const totalBookings = await Appointment.countDocuments();
    const pending = await Appointment.countDocuments({ status: 'PENDING' });
    const confirmed = await Appointment.countDocuments({ status: 'CONFIRMED' });
    const completed = await Appointment.countDocuments({ status: 'COMPLETED' });
    const cancelled = await Appointment.countDocuments({ status: 'CANCELLED' });

    // Most booked services aggregation
    const popularServices = await Appointment.aggregate([
        { $group: { _id: "$service_snapshot.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    res.json({
        summary: {
            total: totalBookings,
            pending,
            confirmed,
            completed,
            cancelled
        },
        popularServices
    });
});

export { createAppointment, getAppointments, updateAppointment, getAnalytics };
