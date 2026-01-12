import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String, // e.g., 'Hair', 'Face', 'Bridal'
        required: true,
    },
    description: {
        type: String,
    },
    duration_minutes: {
        type: Number,
        required: true,
    },
    base_price: {
        type: Number,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
