import asyncHandler from 'express-async-handler';
import Gallery from '../models/Gallery.js';

// @desc    Get gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = asyncHandler(async (req, res) => {
    const gallery = await Gallery.find({}).sort('-createdAt');
    res.json(gallery);
});

// @desc    Add image to gallery
// @route   POST /api/gallery
// @access  Private/Admin
const addImage = asyncHandler(async (req, res) => {
    const { title, category, image } = req.body;
    const galleryItem = await Gallery.create({ title, category, image });
    res.status(201).json(galleryItem);
});

// @desc    Delete image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteImage = asyncHandler(async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    if (item) {
        await item.deleteOne();
        res.json({ message: 'Image removed' });
    } else {
        res.status(404);
        throw new Error('Image not found');
    }
});

export { getGallery, addImage, deleteImage };
