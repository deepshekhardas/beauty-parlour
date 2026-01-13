import express from 'express';
import { createAppointment, getAppointments, updateAppointment, getAnalytics } from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - customer_email
 *               - customer_phone
 *               - service_id
 *               - date
 *               - time_slot
 *             properties:
 *               customer_name:
 *                 type: string
 *               customer_email:
 *                 type: string
 *               customer_phone:
 *                 type: string
 *               service_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time_slot:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *   get:
 *     summary: Get all appointments (Admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.route('/').post(createAppointment).get(protect, admin, getAppointments);

/**
 * @swagger
 * /api/appointments/analytics:
 *   get:
 *     summary: Get appointment analytics (Admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get('/analytics', protect, admin, getAnalytics);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Update appointment status (Admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Appointment updated
 */
router.route('/:id').put(protect, admin, updateAppointment);

export default router;
