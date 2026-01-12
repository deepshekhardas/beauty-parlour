import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';
import Joi from 'joi';

// Validation schema
const serviceSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().allow(''),
    duration_minutes: Joi.number().required(),
    base_price: Joi.number().required(),
    is_active: Joi.boolean(),
});

// @desc    Fetch all active services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
    // If admin, maybe show all? For now public shows active only.
    // Actually, for admin we might want to see inactive ones too.
    // We'll handle that via query param or specific admin route if needed.
    // Start simple: return all active for public.
    const services = await Service.find({ is_active: true });
    res.json(services);
});

// @desc    Fetch all services (Admin)
// @route   GET /api/services/admin
// @access  Private/Admin
const getAllServicesAdmin = asyncHandler(async (req, res) => {
    const services = await Service.find({});
    res.json(services);
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
    const { error } = serviceSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const service = new Service(req.body);
    const createdService = await service.save();
    res.status(201).json(createdService);
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
    const { name, category, description, duration_minutes, base_price, is_active } = req.body;

    const service = await Service.findById(req.params.id);

    if (service) {
        service.name = name || service.name;
        service.category = category || service.category;
        service.description = description || service.description;
        service.duration_minutes = duration_minutes || service.duration_minutes;
        service.base_price = base_price || service.base_price;
        service.is_active = is_active !== undefined ? is_active : service.is_active;

        const updatedService = await service.save();
        res.json(updatedService);
    } else {
        res.status(404);
        throw new Error('Service not found');
    }
});

// @desc    Delete (Soft Delete/Deactivate) a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (service) {
        // Soft delete
        service.is_active = false;
        await service.save();
        res.json({ message: 'Service deactivated' });
    } else {
        res.status(404);
        throw new Error('Service not found');
    }
});

export { getServices, getAllServicesAdmin, createService, updateService, deleteService };
