import express from 'express';
import { getGallery, addImage, deleteImage } from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get all gallery images
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: List of gallery images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gallery'
 *   post:
 *     summary: Add a new image (Admin only)
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gallery'
 *     responses:
 *       201:
 *         description: Image added successfully
 */
router.route('/')
    .get(getGallery)
    .post(protect, admin, addImage);

/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     summary: Delete an image (Admin only)
 *     tags: [Gallery]
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
 *         description: Image deleted
 */
router.route('/:id')
    .delete(protect, admin, deleteImage);

export default router;
