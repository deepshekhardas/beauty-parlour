import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let client;

if (process.env.NODE_ENV !== 'test') {
    client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('connect', () => console.log('✅ Redis Connected'));

    await client.connect();
} else {
    // Mock client for tests if needed, or just don't connect
    client = {
        get: async () => null,
        set: async () => { },
        del: async () => { },
        isOpen: false
    };
}

export default client;
