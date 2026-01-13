import express from 'express';
import { getStaff, getAllStaffAdmin, createStaff, updateStaff, deleteStaff } from '../controllers/staffController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Get all active staff members
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: List of staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 *   post:
 *     summary: Create a new staff member (Admin only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       201:
 *         description: Staff created successfully
 */
router.route('/')
    .get(getStaff)
    .post(protect, admin, createStaff);

/**
 * @swagger
 * /api/staff/admin:
 *   get:
 *     summary: Get all staff including inactive (Admin only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all staff
 */
router.route('/admin').get(protect, admin, getAllStaffAdmin);

/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update a staff member (Admin only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff updated
 *   delete:
 *     summary: Delete a staff member (Admin only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff deleted
 */
router.route('/:id')
    .put(protect, admin, updateStaff)
    .delete(protect, admin, deleteStaff);

export default router;
