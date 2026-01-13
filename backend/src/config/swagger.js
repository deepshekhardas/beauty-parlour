import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Beauty Parlour API',
            version: '1.0.0',
            description: 'API documentation for Beauty Parlour Appointment System',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['customer', 'admin'] },
                        token: { type: 'string' },
                    },
                },
                Service: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        category: { type: 'string' },
                        description: { type: 'string' },
                        duration_minutes: { type: 'number' },
                        base_price: { type: 'number' },
                        is_active: { type: 'boolean' },
                    },
                },
                Appointment: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        customer_name: { type: 'string' },
                        customer_email: { type: 'string' },
                        customer_phone: { type: 'string' },
                        service_id: { type: 'string' },
                        date: { type: 'string', format: 'date' },
                        time_slot: { type: 'string' },
                        status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] },
                    },
                },
                Staff: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        specialization: { type: 'array', items: { type: 'string' } },
                        image: { type: 'string' },
                        is_active: { type: 'boolean' },
                    },
                },
                Gallery: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        image_url: { type: 'string' },
                        category: { type: 'string' },
                    },
                },
                Testimonial: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        customer_name: { type: 'string' },
                        rating: { type: 'number', minimum: 1, maximum: 5 },
                        comment: { type: 'string' },
                        is_approved: { type: 'boolean' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
