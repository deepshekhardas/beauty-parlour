import dotenv from 'dotenv';

dotenv.config();

// Mock client - Redis is optional for this app
// To enable Redis, install and run Redis server, then update this file
const client = {
    get: async () => null,
    set: async () => { },
    del: async () => { },
    isOpen: false,
    isMock: true
};

if (process.env.NODE_ENV !== 'test') {
    console.log('ℹ️ Running without Redis cache (optional feature)');
}

export default client;

