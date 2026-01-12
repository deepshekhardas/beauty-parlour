import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String, // e.g. "Senior Stylist"
        required: true,
    },
    specialization: [{
        type: String // Categories they handle e.g. "Hair", "Face"
    }],
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=300' // Default placeholder
    },
    is_active: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
