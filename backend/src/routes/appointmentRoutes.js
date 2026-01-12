import express from 'express';
import { createAppointment, getAppointments, updateAppointment, getAnalytics } from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createAppointment).get(protect, admin, getAppointments);
router.get('/analytics', protect, admin, getAnalytics);
router.route('/:id').put(protect, admin, updateAppointment);

export default router;
