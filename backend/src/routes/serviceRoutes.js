import express from 'express';
import {
    getServices,
    getAllServicesAdmin,
    createService,
    updateService,
    deleteService,
} from '../controllers/serviceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getServices).post(protect, admin, createService);
router.route('/admin').get(protect, admin, getAllServicesAdmin);
router.route('/:id').put(protect, admin, updateService).delete(protect, admin, deleteService);

export default router;
