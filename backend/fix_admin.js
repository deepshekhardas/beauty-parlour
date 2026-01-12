
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

dotenv.config();
connectDB();

const fixAdmin = async () => {
    try {
        const email = '2f1000863@ds.study.iitm.ac.in';
        const password = 'password123';

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists. Updating password and role...');
            user.password = password; // Will be hashed by pre-save middleware
            user.role = 'admin';
            await user.save();
        } else {
            console.log('User not found. Creating new admin...');
            user = await User.create({
                name: 'IITM Admin',
                email: email,
                password: password,
                role: 'admin',
                phone: '0000000000'
            });
        }

        console.log(`\nSUCCESS! Admin configured:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

fixAdmin();
