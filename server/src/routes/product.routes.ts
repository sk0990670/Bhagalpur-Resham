import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../validations/product.validation';

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List all products with filtering, sorting, and pagination
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Full-text search across name, description, tags
 *       - in: query
 *         name: weaveType
 *         schema: { type: string, enum: [Tussar, Mulberry, Eri, Muga, Blended] }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: minRating
 *         schema: { type: number, minimum: 1, maximum: 5 }
 *       - in: query
 *         name: isFeatured
 *         schema: { type: boolean }
 *       - in: query
 *         name: inStock
 *         schema: { type: boolean }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [price_asc, price_desc, rating_desc, newest, popular] }
 *     responses:
 *       200:
 *         description: Paginated product list
 */
const router = Router();

// Public routes
router.get('/', validate(productQuerySchema, 'query'), productController.listProducts);
router.get('/featured', productController.getFeatured);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/sku/:sku', productController.getProductBySku);

// Admin routes
router.get('/all', authenticate, authorize('admin', 'superadmin'), productController.listAllProductsForAdmin);

router.get('/:id', productController.getProductById);


router.post('/', authenticate, authorize('admin', 'superadmin'), validate(createProductSchema), productController.createProduct);
router.patch('/:id', authenticate, authorize('admin', 'superadmin'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), productController.deleteProduct);
router.post('/:id/images', authenticate, authorize('admin', 'superadmin'), productController.addImage);
router.delete('/:id/images/:publicId', authenticate, authorize('admin', 'superadmin'), productController.removeImage);

export default router;
