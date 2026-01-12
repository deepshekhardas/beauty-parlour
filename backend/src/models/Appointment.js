import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
    },
    customer_phone: {
        type: String,
        required: true,
    },
    customer_email: {
        type: String,
        required: true, // Required for confirmation emails
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please add a valid email']
    },
    // specific customer account is optional if they are a guest
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    // Snapshot of service details at the time of booking
    service_snapshot: {
        name: String,
        price: Number,
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    time_slot: {
        type: String, // "10:00-11:00"
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING',
    },
    notes: {
        type: String,
    },
    payment_info: {
        transaction_id: String,
        amount: Number,
        currency: { type: String, default: 'INR' },
        status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
        method: { type: String, enum: ['CASH', 'ONLINE'], default: 'CASH' }
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
