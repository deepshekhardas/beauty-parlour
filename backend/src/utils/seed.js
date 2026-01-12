import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';
import Gallery from '../models/Gallery.js';
import Testimonial from '../models/Testimonial.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Service.deleteMany();

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            phone: '1234567890'
        });

        const sampleServices = [
            {
                name: 'Basic Haircut',
                category: 'Hair',
                description: 'Standard haircut with wash and blowdry',
                duration_minutes: 60,
                base_price: 50,
                is_active: true
            },
            {
                name: 'Gel Manicure',
                category: 'Nails',
                description: 'Long lasting gel polish application',
                duration_minutes: 45,
                base_price: 35,
                is_active: true
            },
            {
                name: 'Full Facial',
                category: 'Face',
                description: 'Deep cleansing and relaxing facial',
                duration_minutes: 90,
                base_price: 80,
                is_active: true
            }
        ];

        await Service.insertMany(sampleServices);

        const staff = await Staff.create([
            { name: 'Sarah Jones', role: 'Senior Stylist', specialization: ['Hair'], image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?fit=crop&w=500' },
            { name: 'Emily Blunt', role: 'Makeup Artist', specialization: ['Face'], image: 'https://images.unsplash.com/photo-1512258909893-6afc537f26f6?fit=crop&w=500' },
            { name: 'Jessica Lee', role: 'Nail Technician', specialization: ['Nails'], image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?fit=crop&w=500' }
        ]);

        await Gallery.create([
            { title: 'Bridal Glow', category: 'Makeup', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?fit=crop&w=500' },
            { title: 'Elegant Updo', category: 'Hair', image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?fit=crop&w=500' },
            { title: 'Summer Nails', category: 'Nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?fit=crop&w=500' },
            { title: 'Facial Therapy', category: 'Face', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?fit=crop&w=500' }
        ]);

        await Testimonial.create([
            { customer_name: 'Anita Roy', rating: 5, comment: 'Absolutely loved the service! Sarah is a magician with hair.', is_featured: true },
            { customer_name: 'Priya Sharma', rating: 4, comment: 'Great relaxing facial. Highly recommended.', is_featured: true },
            { customer_name: 'Linda K.', rating: 5, comment: 'Best nail art in town!', is_featured: true }
        ]);

        console.log('Data Imported!');
        console.log('Admin: admin@example.com / password123');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Service.deleteMany();
        await Staff.deleteMany();
        await Gallery.deleteMany();
        await Testimonial.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
