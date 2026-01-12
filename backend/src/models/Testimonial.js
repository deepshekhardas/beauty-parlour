import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
    },
    is_featured: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
