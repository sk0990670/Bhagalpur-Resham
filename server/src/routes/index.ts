import { Router, Request, Response } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import productRouter from './product.routes';
import { categoryRouter, cartRouter, wishlistRouter, orderRouter, reviewRouter, couponRouter, cmsRouter, bannerRouter, paymentRouter, analyticsRouter, invoiceRouter, artisanRouter } from './all.routes';
import creditRouter from './credit.routes';
import notificationRouter from './notification.routes';
import mongoose from 'mongoose';

/**
 * Root API router — mounts all module routers under /api
 */
const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Health check endpoint (used by Docker + load balancers)
 *     security: []
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is degraded
 */
router.get('/health', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  const healthy = dbState === 1;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    services: {
      database: dbStatus,
    },
    version: process.env.npm_package_version ?? '1.0.0',
  });
});

import uploadRouter from './upload.routes';

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/cart', cartRouter);
router.use('/wishlist', wishlistRouter);
router.use('/orders', orderRouter);
router.use('/invoices', invoiceRouter);
router.use('/reviews', reviewRouter);
router.use('/coupons', couponRouter);
router.use('/cms', cmsRouter);
router.use('/banners', bannerRouter);
router.use('/payments', paymentRouter);
router.use('/analytics', analyticsRouter);
router.use('/artisans', artisanRouter);
router.use('/upload', uploadRouter);
router.use('/credits', creditRouter);
router.use('/notifications', notificationRouter);

// ── Contact Inquiry (Mock) ────────────────────────────────────
router.post('/contact', (req: Request, res: Response) => {
  console.log('Received contact inquiry:', req.body);
  res.status(200).json({ 
    success: true, 
    message: 'We have received your inquiry and will get back to you shortly.' 
  });
});

export default router;
