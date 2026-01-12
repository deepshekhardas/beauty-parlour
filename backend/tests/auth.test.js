import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import User from '../src/models/User.js';

describe('Auth Routes', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
    };

    describe('POST /api/users', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/users')
                .send(userData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('token');
            expect(res.body.name).toEqual(userData.name);
        });

        it('should not register user with duplicate email', async () => {
            await request(app).post('/api/users').send(userData);

            const res = await request(app)
                .post('/api/users')
                .send(userData);

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/users').send(userData);
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: userData.email,
                    password: userData.password
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: userData.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(401);
        });
    });
});
