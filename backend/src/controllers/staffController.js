import asyncHandler from 'express-async-handler';
import Staff from '../models/Staff.js';

// @desc    Get all staff
// @route   GET /api/staff
// @access  Public
const getStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.find({ is_active: true });
    res.json(staff);
});

// @desc    Get all staff (Admin)
// @route   GET /api/staff/admin
// @access  Private/Admin
const getAllStaffAdmin = asyncHandler(async (req, res) => {
    const staff = await Staff.find({});
    res.json(staff);
});

// @desc    Create staff member
// @route   POST /api/staff
// @access  Private/Admin
const createStaff = asyncHandler(async (req, res) => {
    const { name, role, specialization, image } = req.body;
    const staff = await Staff.create({ name, role, specialization, image });
    res.status(201).json(staff);
});

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.findById(req.params.id);
    if (staff) {
        staff.name = req.body.name || staff.name;
        staff.role = req.body.role || staff.role;
        staff.specialization = req.body.specialization || staff.specialization;
        staff.image = req.body.image || staff.image;
        staff.is_active = req.body.is_active !== undefined ? req.body.is_active : staff.is_active;

        const updatedStaff = await staff.save();
        res.json(updatedStaff);
    } else {
        res.status(404);
        throw new Error('Staff not found');
    }
});

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.findById(req.params.id);
    if (staff) {
        await staff.deleteOne();
        res.json({ message: 'Staff removed' });
    } else {
        res.status(404);
        throw new Error('Staff not found');
    }
});

export { getStaff, getAllStaffAdmin, createStaff, updateStaff, deleteStaff };
