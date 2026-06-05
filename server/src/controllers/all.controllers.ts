import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { categoryService } from '../services/category.service';
import { cartService } from '../services/cart.service';
import { wishlistService } from '../services/wishlist.service';
import { orderService } from '../services/order.service';
import { reviewService } from '../services/review.service';
import { couponService } from '../services/coupon.service';
import { cmsService } from '../services/cms.service';
import { paymentService } from '../services/payment.service';
import { analyticsService } from '../services/analytics.service';
import { cloudinary } from '../config/cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { valkeyClient } from '../config/valkey';

// ── Upload Controller ────────────────────────────────────────
class UploadController {
  uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest('No image file provided');
    }
    
    // Upload memory buffer to Cloudinary using a stream
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'bhagalpur-resham/products' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file!.buffer);
    });

    res.status(201).json(ApiResponse.created('Image uploaded successfully', {
      url: result.secure_url,
      publicId: result.public_id,
    }));
  });

  uploadImageTemp = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest('No image file provided');
    }
    
    const tempId = uuidv4();
    // Save buffer as a base64 string in Valkey (TTL 1 hour)
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    
    await valkeyClient.setex(`temp_image:${tempId}`, 3600, JSON.stringify({ mimeType, data: base64Data }));

    res.status(201).json(ApiResponse.created('Image saved to temporary storage', { tempId }));
  });

  getPreview = asyncHandler(async (req: Request, res: Response) => {
    const { tempId } = req.params;
    const imageData = await valkeyClient.get(`temp_image:${tempId}`);
    
    if (!imageData) {
      res.status(404).send('Image not found or expired');
      return;
    }

    const { mimeType, data } = JSON.parse(imageData);
    const buffer = Buffer.from(data, 'base64');
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', buffer.length);
    res.status(200).send(buffer);
  });
}
export const uploadController = new UploadController();

// ── Category Controller ──────────────────────────────────────
class CategoryController {
  list = asyncHandler(async (req, res) => { const r = await categoryService.listCategories(req); res.json(ApiResponse.ok('Categories', r.data, r.meta)); });
  tree = asyncHandler(async (_req, res) => { res.json(ApiResponse.ok('Category tree', await categoryService.getCategoryTree())); });
  getBySlug = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Category', await categoryService.getCategoryBySlug(req.params.slug as string))); });
  children = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Children', await categoryService.getChildren(req.params.id as string))); });
  create = asyncHandler(async (req, res) => { res.status(201).json(ApiResponse.created('Category created', await categoryService.createCategory(req.body))); });
  update = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Category updated', await categoryService.updateCategory(req.params.id as string, req.body))); });
  delete = asyncHandler(async (req, res) => { await categoryService.deleteCategory(req.params.id as string); res.json(ApiResponse.ok('Category deleted')); });
}
export const categoryController = new CategoryController();

// ── Cart Controller ──────────────────────────────────────────
class CartController {
  getCart = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Cart', await cartService.getCart(req.user!.userId))); });
  addItem = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Item added', await cartService.addToCart(req.user!.userId, req.body.productId, req.body.qty))); });
  updateItem = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Cart updated', await cartService.updateCartItem(req.user!.userId, req.params.productId as string, req.body.qty))); });
  removeItem = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Item removed', await cartService.removeFromCart(req.user!.userId, req.params.productId as string))); });
  clearCart = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Cart cleared', await cartService.clearCart(req.user!.userId))); });
  syncCart = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Cart synced', await cartService.syncCart(req.user!.userId))); });
}
export const cartController = new CartController();

// ── Wishlist Controller ──────────────────────────────────────
class WishlistController {
  getWishlist = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Wishlist', await wishlistService.getWishlist(req.user!.userId))); });
  addItem = asyncHandler(async (req, res) => { res.status(201).json(ApiResponse.created('Added to wishlist', await wishlistService.addToWishlist(req.user!.userId, req.body.productId))); });
  removeItem = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Removed from wishlist', await wishlistService.removeFromWishlist(req.user!.userId, req.params.productId as string))); });
  clearWishlist = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Wishlist cleared', await wishlistService.clearWishlist(req.user!.userId))); });
  check = asyncHandler(async (req, res) => { const isIn = await wishlistService.isInWishlist(req.user!.userId, req.params.productId as string); res.json(ApiResponse.ok('Check', { inWishlist: isIn })); });
}
export const wishlistController = new WishlistController();

// ── Order Controller ─────────────────────────────────────────
class OrderController {
  calculatePricing = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Pricing calculated', await orderService.calculateOrderPricing(req.user!.userId, req.body))); });
  placeOrder = asyncHandler(async (req, res) => { res.status(201).json(ApiResponse.created('Order placed', await orderService.initiateOrder(req.user!.userId, req.body))); });
  getMyOrders = asyncHandler(async (req, res) => { const r = await orderService.getMyOrders(req.user!.userId, req); res.json(ApiResponse.ok('Orders', r.data, r.meta)); });
  getOrderById = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Order', await orderService.getOrderById(req.params.id as string, req.user!.userId, req.user!.role))); });
  updateStatus = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Status updated', await orderService.updateOrderStatus(req.params.id as string, req.body.status, req.user!.userId, req.body))); });
  cancelOrder = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Order cancelled', await orderService.cancelOrder(req.params.id as string, req.user!.userId, req.body.reason))); });
  listAllOrders = asyncHandler(async (req, res) => { const r = await orderService.listAllOrders(req); res.json(ApiResponse.ok('All orders', r.data, r.meta)); });
  
  // Specific Admin Actions
  verifyPaymentAdmin = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Payment verified', await orderService.verifyPaymentAdmin(req.params.id as string, req.body.action, req.user!.userId))); });
  assignArtisan = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Artisan assigned', await orderService.assignArtisan(req.params.id as string, req.body.artisanId, req.user!.userId))); });
  updateProductionStage = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Production stage updated', await orderService.updateProductionStage(req.params.id as string, req.body.stage, req.user!.userId))); });
  markReadyForShipping = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Ready for shipping', await orderService.markReadyForShipping(req.params.id as string, req.user!.userId))); });
  shipOrder = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Order shipped', await orderService.shipOrder(req.params.id as string, req.body, req.user!.userId))); });
  markDelivered = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Order delivered', await orderService.markDelivered(req.params.id as string, req.user!.userId))); });
  downloadInvoice = asyncHandler(async (req, res) => {
    const { pdfService } = await import('../services/pdf.service');
    const order = await orderService.getOrderById(req.params.id as string, req.user!.userId, req.user!.role);
    const pdfBuffer = await pdfService.generateInvoice(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${order.orderId}.pdf`);
    res.send(pdfBuffer);
  });
}
export const orderController = new OrderController();

// ── Review Controller ────────────────────────────────────────
class ReviewController {
  getProductReviews = asyncHandler(async (req, res) => { const r = await reviewService.getProductReviews(req.params.productId as string, req); res.json(ApiResponse.ok('Reviews', r)); });
  submitReview = asyncHandler(async (req, res) => { res.status(201).json(ApiResponse.created('Review submitted', await reviewService.submitReview(req.user!.userId, req.body))); });
  moderateReview = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Review moderated', await reviewService.moderateReview(req.params.id as string, req.body))); });
  voteHelpful = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Vote recorded', await reviewService.voteHelpful(req.params.id as string, req.user!.userId))); });
  deleteReview = asyncHandler(async (req, res) => { await reviewService.deleteReview(req.params.id as string, req.user!.userId, req.user!.role); res.json(ApiResponse.ok('Review deleted')); });
  getPendingReviews = asyncHandler(async (req, res) => { const r = await reviewService.getPendingReviews(req); res.json(ApiResponse.ok('Pending reviews', r.data, r.meta)); });
}
export const reviewController = new ReviewController();

// ── Coupon Controller ────────────────────────────────────────
class CouponController {
  list = asyncHandler(async (req, res) => { const r = await couponService.listCoupons(req); res.json(ApiResponse.ok('Coupons', r.data, r.meta)); });
  getById = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Coupon', await couponService.getCouponById(req.params.id as string))); });
  create = asyncHandler(async (req, res) => { res.status(201).json(ApiResponse.created('Coupon created', await couponService.createCoupon(req.body, req.user!.userId))); });
  update = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Coupon updated', await couponService.updateCoupon(req.params.id as string, req.body))); });
  delete = asyncHandler(async (req, res) => { await couponService.deleteCoupon(req.params.id as string); res.json(ApiResponse.ok('Coupon deleted')); });
  validate = asyncHandler(async (req: Request, res: Response) => {
    const { code, orderTotal } = req.body;
    const result = await couponService.validateCoupon(code, orderTotal, req.user!.userId);
    res.json(ApiResponse.ok('Coupon valid', result));
  });
}
export const couponController = new CouponController();

// ── CMS Controller ───────────────────────────────────────────
class CmsController {
  // Public Story Page
  getStoryStats = asyncHandler(async (_req, res) => { res.json(ApiResponse.ok('Story stats', await cmsService.getStoryStats())); });
  getPublicArtisans = asyncHandler(async (_req, res) => { res.json(ApiResponse.ok('Public artisans', await cmsService.getPublicArtisans())); });

  listContent = asyncHandler(async (req, res) => { const r = await cmsService.listContent(req); res.json(ApiResponse.ok('Content', r.data, r.meta)); });
  getBySlug = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Content', await cmsService.getContentBySlug(req.params.slug as string, req.params.type as string))); });
  getFAQs = asyncHandler(async (_req, res) => { res.json(ApiResponse.ok('FAQs', await cmsService.getFAQs())); });
  create = asyncHandler(async (req, res) => { res.status(201).json(ApiResponse.created('Content created', await cmsService.createContent(req.body, req.user!.userId))); });
  update = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Content updated', await cmsService.updateContent(req.params.id as string, req.body, req.user!.userId))); });
  delete = asyncHandler(async (req, res) => { await cmsService.deleteContent(req.params.id as string); res.json(ApiResponse.ok('Content deleted')); });
  publish = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Published', await cmsService.publishContent(req.params.id as string))); });
  unpublish = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Unpublished', await cmsService.unpublishContent(req.params.id as string))); });
  // Banners
  getBanners = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Banners', await cmsService.getBannersByPlacement(req.params.placement as string))); });
  listBanners = asyncHandler(async (req, res) => { const r = await cmsService.listBanners(req); res.json(ApiResponse.ok('Banners', r.data, r.meta)); });
  createBanner = asyncHandler(async (req, res) => { res.status(201).json(ApiResponse.created('Banner created', await cmsService.createBanner(req.body, req.user!.userId))); });
  updateBanner = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Banner updated', await cmsService.updateBanner(req.params.id as string, req.body, req.user!.userId))); });
  deleteBanner = asyncHandler(async (req, res) => { await cmsService.deleteBanner(req.params.id as string); res.json(ApiResponse.ok('Banner deleted')); });
  trackClick = asyncHandler(async (req, res) => { await cmsService.trackBannerClick(req.params.id as string); res.json(ApiResponse.ok('Tracked')); });
}
export const cmsController = new CmsController();

// ── Payment Controller ───────────────────────────────────────
class PaymentController {
  getKey = asyncHandler(async (_req, res) => { res.json(ApiResponse.ok('Key', await paymentService.getRazorpayKey())); });
  initOrder = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Razorpay Intent generated', await paymentService.initRazorpayOrder(req.user!.userId, req.body))); });
  createOrder = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Razorpay order created', await paymentService.createRazorpayOrder(req.params.orderId as string))); });
  verify = asyncHandler(async (req, res) => { res.json(ApiResponse.ok('Payment verified', await paymentService.verifyPayment(req.body))); });
}
export const paymentController = new PaymentController();

// ── Analytics Controller ─────────────────────────────────────
class AnalyticsController {
  dashboard = asyncHandler(async (_req, res) => { res.json(ApiResponse.ok('Dashboard stats', await analyticsService.getDashboardStats())); });
  sales = asyncHandler(async (req, res) => { const days = parseInt(req.query.days as string) || 30; res.json(ApiResponse.ok('Sales chart', await analyticsService.getSalesChart(days))); });
  topProducts = asyncHandler(async (req, res) => { const limit = parseInt(req.query.limit as string) || 10; res.json(ApiResponse.ok('Top products', await analyticsService.getTopProducts(limit))); });
  orderStatus = asyncHandler(async (_req, res) => { res.json(ApiResponse.ok('Order status breakdown', await analyticsService.getOrderStatusBreakdown())); });
  revenueByCategory = asyncHandler(async (_req, res) => { res.json(ApiResponse.ok('Revenue by category', await analyticsService.getRevenueByCategory())); });
  customerGrowth = asyncHandler(async (req, res) => { const days = parseInt(req.query.days as string) || 30; res.json(ApiResponse.ok('Customer growth', await analyticsService.getCustomerGrowth(days))); });
}
export const analyticsController = new AnalyticsController();
