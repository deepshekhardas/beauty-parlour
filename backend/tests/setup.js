import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Use local MongoDB for tests instead of mongodb-memory-server
// This avoids MD5 checksum issues with downloading MongoDB binaries

beforeAll(async () => {
    // Connect to local MongoDB test database
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beautyparlour-test';

    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Test DB connected successfully (Local MongoDB)');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('💡 Make sure MongoDB is running: mongod --dbpath="C:\\data\\db"');
        throw error;
    }
}, 30000);

beforeEach(async () => {
    // Clean all collections before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    // Cleanup and close connection
    if (mongoose.connection.readyState !== 0) {
        // Drop the test database
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
}, 30000);
