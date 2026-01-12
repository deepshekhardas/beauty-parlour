import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';

// Initialize Razorpay
// If env vars are missing, we can check in the method or fail gracefully
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_missing', // Fallback for dev safety
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_missing'
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Public (or Private depending on flow, keeping public for easier testing)
const createOrder = asyncHandler(async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;

    // Basic validation
    if (!amount) {
        res.status(400);
        throw new Error('Amount is required');
    }

    if (!process.env.RAZORPAY_KEY_ID) {
        res.status(503);
        throw new Error('Razorpay keys not configured on server');
    }

    const options = {
        amount: amount * 100, // Razorpay works in smallest currency unit (paise)
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500);
        throw new Error('Something went wrong with payment gateway');
    }
});

// @desc    Verify Payment
// @route   POST /api/payments/verify
// @access  Public
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointment_data } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment is verified
        // Optional: Create appointment here if you want to book ONLY after payment
        // We will return success so frontend can call createAppointment with payment details

        res.json({
            success: true,
            message: 'Payment verified successfully',
            payment_id: razorpay_payment_id
        });
    } else {
        res.status(400);
        throw new Error('Invalid signature');
    }
});

export { createOrder, verifyPayment };
