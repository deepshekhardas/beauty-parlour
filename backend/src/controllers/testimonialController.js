import asyncHandler from 'express-async-handler';
import Testimonial from '../models/Testimonial.js';

// @desc    Get featured testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({ is_featured: true }).limit(10);
    res.json(testimonials);
});

// @desc    Get all testimonials (Admin)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
const getAllTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
});

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Public
const createTestimonial = asyncHandler(async (req, res) => {
    const { customer_name, rating, comment } = req.body;
    const testimonial = await Testimonial.create({
        customer_name,
        rating,
        comment,
        is_featured: false // Default to false, admin must approve/feature
    });
    res.status(201).json(testimonial);
});

// @desc    Update testimonial (Feature/Unfeature)
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
        testimonial.is_featured = req.body.is_featured !== undefined ? req.body.is_featured : testimonial.is_featured;
        await testimonial.save();
        res.json(testimonial);
    } else {
        res.status(404);
        throw new Error('Testimonial not found');
    }
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
        await testimonial.deleteOne();
        res.json({ message: 'Testimonial removed' });
    } else {
        res.status(404);
        throw new Error('Testimonial not found');
    }
});

export { getTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
