import { Router } from 'express';
import { categoryController, cartController, wishlistController, orderController, reviewController, couponController, cmsController, paymentController, analyticsController } from '../controllers/all.controllers';
import { invoiceController } from '../controllers/invoice.controller';
import * as artisanController from '../controllers/artisan.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema, createOrderSchema, updateOrderStatusSchema, addToCartSchema, updateCartItemSchema, createReviewSchema, moderateReviewSchema, createCouponSchema, updateCouponSchema, applyCouponSchema, createCmsSchema, updateCmsSchema, createBannerSchema, updateBannerSchema, verifyPaymentSchema } from '../validations/all.validation';

// ── Categories ────────────────────────────────────────────────
export const categoryRouter = Router();
categoryRouter.get('/', categoryController.list);
categoryRouter.get('/tree', categoryController.tree);
categoryRouter.get('/slug/:slug', categoryController.getBySlug);
categoryRouter.get('/:id/children', categoryController.children);
categoryRouter.post('/', authenticate, authorize('admin', 'superadmin'), validate(createCategorySchema), categoryController.create);
categoryRouter.patch('/:id', authenticate, authorize('admin', 'superadmin'), validate(updateCategorySchema), categoryController.update);
categoryRouter.delete('/:id', authenticate, authorize('admin', 'superadmin'), categoryController.delete);

// ── Cart ─────────────────────────────────────────────────────
export const cartRouter = Router();
cartRouter.use(authenticate);
cartRouter.get('/', cartController.getCart);
cartRouter.post('/items', validate(addToCartSchema), cartController.addItem);
cartRouter.patch('/items/:productId', validate(updateCartItemSchema), cartController.updateItem);
cartRouter.delete('/items/:productId', cartController.removeItem);
cartRouter.delete('/', cartController.clearCart);
cartRouter.post('/sync', cartController.syncCart);

// ── Wishlist ──────────────────────────────────────────────────
export const wishlistRouter = Router();
wishlistRouter.use(authenticate);
wishlistRouter.get('/', wishlistController.getWishlist);
wishlistRouter.post('/items', wishlistController.addItem);
wishlistRouter.delete('/items/:productId', wishlistController.removeItem);
wishlistRouter.delete('/', wishlistController.clearWishlist);
wishlistRouter.get('/check/:productId', wishlistController.check);

// ── Orders ────────────────────────────────────────────────────
export const orderRouter = Router();
orderRouter.use(authenticate);
orderRouter.post('/calculate-pricing', orderController.calculatePricing);
orderRouter.post('/', validate(createOrderSchema), orderController.placeOrder);
orderRouter.get('/my-orders', orderController.getMyOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.get('/:id/invoice', orderController.downloadInvoice);
orderRouter.patch('/:id/cancel', orderController.cancelOrder);
// Admin
orderRouter.get('/', authorize('admin', 'superadmin'), orderController.listAllOrders);
orderRouter.patch('/:id/status', authorize('admin', 'superadmin'), validate(updateOrderStatusSchema), orderController.updateStatus);
orderRouter.patch('/:id/verify-payment', authorize('admin', 'superadmin'), orderController.verifyPaymentAdmin);
orderRouter.patch('/:id/assign-artisan', authorize('admin', 'superadmin'), orderController.assignArtisan);
orderRouter.patch('/:id/update-production-stage', authorize('admin', 'superadmin', 'artisan'), orderController.updateProductionStage);
orderRouter.patch('/:id/ready-for-shipping', authorize('admin', 'superadmin', 'artisan'), orderController.markReadyForShipping);
orderRouter.patch('/:id/ship', authorize('admin', 'superadmin'), orderController.shipOrder);
orderRouter.patch('/:id/deliver', authorize('admin', 'superadmin'), orderController.markDelivered);

// ── Invoices ──────────────────────────────────────────────────
export const invoiceRouter = Router();
invoiceRouter.use(authenticate);
invoiceRouter.get('/:orderId', invoiceController.getInvoice);
invoiceRouter.get('/:orderId/download', invoiceController.downloadInvoice);

// ── Reviews ───────────────────────────────────────────────────
export const reviewRouter = Router();
reviewRouter.get('/product/:productId', reviewController.getProductReviews);
reviewRouter.post('/', authenticate, validate(createReviewSchema), reviewController.submitReview);
reviewRouter.patch('/:id/helpful', authenticate, reviewController.voteHelpful);
reviewRouter.delete('/:id', authenticate, reviewController.deleteReview);
// Admin
reviewRouter.get('/pending', authenticate, authorize('admin', 'superadmin'), reviewController.getPendingReviews);
reviewRouter.patch('/:id/moderate', authenticate, authorize('admin', 'superadmin'), validate(moderateReviewSchema), reviewController.moderateReview);

// ── Coupons ───────────────────────────────────────────────────
export const couponRouter = Router();
couponRouter.post('/validate', authenticate, validate(applyCouponSchema), couponController.validate);
couponRouter.use(authenticate, authorize('admin', 'superadmin'));
couponRouter.get('/', couponController.list);
couponRouter.get('/:id', couponController.getById);
couponRouter.post('/', validate(createCouponSchema), couponController.create);
couponRouter.patch('/:id', validate(updateCouponSchema), couponController.update);
couponRouter.delete('/:id', couponController.delete);

// ── CMS ───────────────────────────────────────────────────────
export const cmsRouter = Router();
cmsRouter.get('/story-stats', cmsController.getStoryStats);
cmsRouter.get('/public-artisans', cmsController.getPublicArtisans);
cmsRouter.get('/faqs', cmsController.getFAQs);
cmsRouter.get('/banners/:placement', cmsController.getBanners);
cmsRouter.get('/:type/:slug', cmsController.getBySlug);
cmsRouter.get('/', cmsController.listContent);
// Admin
cmsRouter.post('/', authenticate, authorize('admin', 'superadmin'), validate(createCmsSchema), cmsController.create);
cmsRouter.patch('/:id', authenticate, authorize('admin', 'superadmin'), validate(updateCmsSchema), cmsController.update);
cmsRouter.delete('/:id', authenticate, authorize('admin', 'superadmin'), cmsController.delete);
cmsRouter.patch('/:id/publish', authenticate, authorize('admin', 'superadmin'), cmsController.publish);
cmsRouter.patch('/:id/unpublish', authenticate, authorize('admin', 'superadmin'), cmsController.unpublish);

// ── Banners (admin CRUD) ──────────────────────────────────────
export const bannerRouter = Router();
bannerRouter.get('/', cmsController.listBanners);
bannerRouter.post('/track-click/:id', cmsController.trackClick);
bannerRouter.post('/', authenticate, authorize('admin', 'superadmin'), validate(createBannerSchema), cmsController.createBanner);
bannerRouter.patch('/:id', authenticate, authorize('admin', 'superadmin'), validate(updateBannerSchema), cmsController.updateBanner);
bannerRouter.delete('/:id', authenticate, authorize('admin', 'superadmin'), cmsController.deleteBanner);

// ── Payments ──────────────────────────────────────────────────
export const paymentRouter = Router();
paymentRouter.get('/key', paymentController.getKey);
paymentRouter.post('/create-order', authenticate, paymentController.initOrder); // Renamed from /init for new architecture
paymentRouter.post('/create-order/:orderId', authenticate, paymentController.createOrder); // Legacy
paymentRouter.post('/verify', authenticate, validate(verifyPaymentSchema), paymentController.verify);

// ── Analytics ─────────────────────────────────────────────────
export const analyticsRouter = Router();
analyticsRouter.use(authenticate, authorize('admin', 'superadmin'));
analyticsRouter.get('/dashboard', analyticsController.dashboard);
analyticsRouter.get('/sales', analyticsController.sales);
analyticsRouter.get('/top-products', analyticsController.topProducts);
analyticsRouter.get('/order-status', analyticsController.orderStatus);
analyticsRouter.get('/revenue-by-category', analyticsController.revenueByCategory);
analyticsRouter.get('/customer-growth', analyticsController.customerGrowth);

// ── Artisans ──────────────────────────────────────────────────
export const artisanRouter = Router();
artisanRouter.use(authenticate, authorize('admin', 'superadmin'));
artisanRouter.get('/stats', artisanController.getDashboardStats);
artisanRouter.get('/recommended', artisanController.getRecommendedArtisans);
artisanRouter.get('/', artisanController.getAllArtisans);
artisanRouter.get('/:id', artisanController.getArtisanById);
artisanRouter.get('/:id/orders', artisanController.getArtisanOrders);
artisanRouter.post('/', artisanController.createArtisan);
artisanRouter.patch('/:id', artisanController.updateArtisan);
artisanRouter.patch('/assignments/:assignmentId/payment', artisanController.updateAssignmentPayment);
artisanRouter.delete('/:id', artisanController.deleteArtisan);
