import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load test environment variables
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
    // Connect to test database
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Test DB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed!');
        console.error('Please ensure MongoDB is running. See TESTING.md for setup instructions.');
        console.error('Error:', error.message);
        throw error;
    }
}, 30000);

afterAll(async () => {
    // Cleanup and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}, 30000);
