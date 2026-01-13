import asyncHandler from 'express-async-handler';
import Gallery from '../models/Gallery.js';
import redisClient from '../config/redis.js';

// @desc    Get gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = asyncHandler(async (req, res) => {
    try {
        const cachedGallery = await redisClient.get('gallery');
        if (cachedGallery) {
            return res.json(JSON.parse(cachedGallery));
        }

        const gallery = await Gallery.find({}).sort('-createdAt');
        await redisClient.set('gallery', JSON.stringify(gallery), { EX: 3600 });
        res.json(gallery);
    } catch (error) {
        const gallery = await Gallery.find({}).sort('-createdAt');
        res.json(gallery);
    }
});

// @desc    Add image to gallery
// @route   POST /api/gallery
// @access  Private/Admin
const addImage = asyncHandler(async (req, res) => {
    const { title, category, image } = req.body;
    const galleryItem = await Gallery.create({ title, category, image });
    await redisClient.del('gallery');
    res.status(201).json(galleryItem);
});

// @desc    Delete image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteImage = asyncHandler(async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    if (item) {
        await item.deleteOne();
        await redisClient.del('gallery');
        res.json({ message: 'Image removed' });
    } else {
        res.status(404);
        throw new Error('Image not found');
    }
});

export { getGallery, addImage, deleteImage };
