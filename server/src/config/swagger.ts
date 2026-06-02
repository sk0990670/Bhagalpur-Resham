import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bhagalpur Resham API',
      version: '1.0.0',
      description:
        'Production-grade REST API for Bhagalpur Resham — Authentic Bhagalpuri Silk E-Commerce Platform',
      contact: {
        name: 'Bhagalpur Resham Team',
        email: 'api@bhagalpurresham.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: 'Development Server',
      },
      {
        url: 'https://api.bhagalpurresham.com/api',
        description: 'Production Server',
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
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            statusCode: { type: 'integer' },
            message: { type: 'string' },
            data: { type: 'object', nullable: true },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'integer' },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Products', description: 'Product catalog' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Cart', description: 'Shopping cart' },
      { name: 'Wishlist', description: 'Product wishlist' },
      { name: 'Orders', description: 'Order management' },
      { name: 'Reviews', description: 'Product reviews' },
      { name: 'Coupons', description: 'Discount coupons' },
      { name: 'Payments', description: 'Razorpay payment integration' },
      { name: 'CMS', description: 'Content management' },
      { name: 'Analytics', description: 'Admin analytics & reports' },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.{ts,js}'),
    path.join(__dirname, '../models/*.{ts,js}')
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
