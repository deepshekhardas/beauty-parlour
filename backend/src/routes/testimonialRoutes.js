import express from 'express';
import { getTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get approved testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: List of approved testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 *   post:
 *     summary: Submit a testimonial
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - rating
 *               - comment
 *             properties:
 *               customer_name:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Testimonial submitted
 */
router.route('/')
    .get(getTestimonials)
    .post(createTestimonial);

/**
 * @swagger
 * /api/testimonials/admin:
 *   get:
 *     summary: Get all testimonials (Admin only)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all testimonials
 */
router.route('/admin').get(protect, admin, getAllTestimonials);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update/approve testimonial (Admin only)
 *     tags: [Testimonials]
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
 *               is_approved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Testimonial updated
 *   delete:
 *     summary: Delete testimonial (Admin only)
 *     tags: [Testimonials]
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
 *         description: Testimonial deleted
 */
router.route('/:id')
    .put(protect, admin, updateTestimonial)
    .delete(protect, admin, deleteTestimonial);

export default router;
