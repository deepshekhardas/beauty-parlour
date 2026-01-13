import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Gallery from '../src/models/Gallery.js';

describe('Gallery Routes', () => {
    let adminToken;
    let imageId;

    beforeEach(async () => {
        await Gallery.deleteMany({});
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

    const imageData = {
        title: 'Beautiful Hairstyle',
        image: 'https://example.com/image.jpg',
        category: 'Hair'
    };

    describe('GET /api/gallery', () => {
        it('should fetch all gallery images', async () => {
            await Gallery.create(imageData);

            const res = await request(app).get('/api/gallery');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('POST /api/gallery', () => {
        it('should add image as admin', async () => {
            const res = await request(app)
                .post('/api/gallery')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(imageData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.title).toEqual(imageData.title);
            imageId = res.body._id;
        });

        it('should fail without auth token', async () => {
            const res = await request(app)
                .post('/api/gallery')
                .send(imageData);

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('DELETE /api/gallery/:id', () => {
        beforeEach(async () => {
            const image = await Gallery.create(imageData);
            imageId = image._id;
        });

        it('should delete image as admin', async () => {
            const res = await request(app)
                .delete(`/api/gallery/${imageId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
        });
    });
});
