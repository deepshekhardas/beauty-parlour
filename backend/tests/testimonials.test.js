import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Testimonial from '../src/models/Testimonial.js';

describe('Testimonial Routes', () => {
    let adminToken;
    let testimonialId;

    beforeEach(async () => {
        await Testimonial.deleteMany({});
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

    const testimonialData = {
        customer_name: 'Happy Customer',
        rating: 5,
        comment: 'Amazing service, highly recommend!'
    };

    describe('GET /api/testimonials', () => {
        it('should fetch approved testimonials', async () => {
            await Testimonial.create({ ...testimonialData, is_featured: true });

            const res = await request(app).get('/api/testimonials');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /api/testimonials', () => {
        it('should submit a testimonial (public)', async () => {
            const res = await request(app)
                .post('/api/testimonials')
                .send(testimonialData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.customer_name).toEqual(testimonialData.customer_name);
        });
    });

    describe('PUT /api/testimonials/:id', () => {
        beforeEach(async () => {
            const testimonial = await Testimonial.create(testimonialData);
            testimonialId = testimonial._id;
        });

        it('should update testimonial (approve) as admin', async () => {
            const res = await request(app)
                .put(`/api/testimonials/${testimonialId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ is_featured: true });

            expect(res.statusCode).toEqual(200);
            expect(res.body.is_featured).toBe(true);
        });
    });

    describe('DELETE /api/testimonials/:id', () => {
        beforeEach(async () => {
            const testimonial = await Testimonial.create(testimonialData);
            testimonialId = testimonial._id;
        });

        it('should delete testimonial as admin', async () => {
            const res = await request(app)
                .delete(`/api/testimonials/${testimonialId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
        });
    });
});
