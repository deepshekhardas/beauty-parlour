import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';

describe('Service Routes', () => {
    let adminToken;
    let serviceId;

    beforeEach(async () => {
        await Service.deleteMany({});
        await User.deleteMany({});

        // Create Admin User
        const adminRes = await request(app).post('/api/users').send({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });
        adminToken = adminRes.body.token;
    });

    const serviceData = {
        name: 'Hair Styling',
        category: 'Hair',
        description: 'Professional hair styling',
        duration_minutes: 60,
        base_price: 100,
        is_active: true
    };

    describe('GET /api/services', () => {
        it('should fetch all active services', async () => {
            await Service.create(serviceData);

            const res = await request(app).get('/api/services');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('POST /api/services', () => {
        it('should create a service as admin', async () => {
            const res = await request(app)
                .post('/api/services')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(serviceData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.name).toEqual(serviceData.name);
            serviceId = res.body._id;
        });

        it('should fail without auth token', async () => {
            const res = await request(app)
                .post('/api/services')
                .send(serviceData);

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('PUT /api/services/:id', () => {
        beforeEach(async () => {
            const service = await Service.create(serviceData);
            serviceId = service._id;
        });

        it('should update a service as admin', async () => {
            const res = await request(app)
                .put(`/api/services/${serviceId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Hair Styling' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual('Updated Hair Styling');
        });
    });

    describe('DELETE /api/services/:id', () => {
        beforeEach(async () => {
            const service = await Service.create(serviceData);
            serviceId = service._id;
        });

        it('should delete a service as admin', async () => {
            const res = await request(app)
                .delete(`/api/services/${serviceId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
        });
    });
});
