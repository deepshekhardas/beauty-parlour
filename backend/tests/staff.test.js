import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Staff from '../src/models/Staff.js';

describe('Staff Routes', () => {
    let adminToken;
    let staffId;

    beforeEach(async () => {
        await Staff.deleteMany({});
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

    const staffData = {
        name: 'Jane Stylist',
        role: 'Senior Stylist',
        specialization: ['Hair', 'Bridal'],
        is_active: true
    };

    describe('GET /api/staff', () => {
        it('should fetch all active staff', async () => {
            await Staff.create(staffData);

            const res = await request(app).get('/api/staff');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('POST /api/staff', () => {
        it('should create staff as admin', async () => {
            const res = await request(app)
                .post('/api/staff')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(staffData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.name).toEqual(staffData.name);
            staffId = res.body._id;
        });

        it('should fail without auth token', async () => {
            const res = await request(app)
                .post('/api/staff')
                .send(staffData);

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('PUT /api/staff/:id', () => {
        beforeEach(async () => {
            const staff = await Staff.create(staffData);
            staffId = staff._id;
        });

        it('should update staff as admin', async () => {
            const res = await request(app)
                .put(`/api/staff/${staffId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Jane' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual('Updated Jane');
        });
    });

    describe('DELETE /api/staff/:id', () => {
        beforeEach(async () => {
            const staff = await Staff.create(staffData);
            staffId = staff._id;
        });

        it('should delete staff as admin', async () => {
            const res = await request(app)
                .delete(`/api/staff/${staffId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
        });
    });
});
