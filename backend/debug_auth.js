
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

dotenv.config();
connectDB();

const debugAuth = async () => {
    try {
        const email = '2f1000863@ds.study.iitm.ac.in';
        const rawPassword = 'password123';

        console.log(`\n--- DEBUG AUTH FOR: ${email} ---`);

        // 1. Find User
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User NOT FOUND in database!');
            // Try fuzzy search
            const allUsers = await User.find({});
            console.log('Available users:', allUsers.map(u => u.email));
        } else {
            console.log('✅ User FOUND');
            console.log(`   ID: ${user._id}`);
            console.log(`   Stored Email: "${user.email}"`);
            console.log(`   Stored Hash:  ${user.password.substring(0, 20)}...`);

            // 2. Test Compare
            console.log(`\n--- Testing Password: "${rawPassword}" ---`);
            const isMatch = await bcrypt.compare(rawPassword, user.password);

            if (isMatch) {
                console.log('✅ bcrypt.compare returned TRUE');
                console.log('   (The password in DB is correct)');
            } else {
                console.log('❌ bcrypt.compare returned FALSE');
                console.log('   (The stored hash does not match "password123")');

                // 3. Attempt Fix
                console.log('\n--- ATTEMPTING FORCE RESET ---');
                user.password = rawPassword;
                // Note: userSchema.pre('save') will hash this!
                await user.save();
                console.log('   Password reset and saved.');

                const newMatch = await bcrypt.compare(rawPassword, user.password);
                console.log(`   Re-test result: ${newMatch ? 'PASS ✅' : 'FAIL ❌'}`);
            }
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

debugAuth();
