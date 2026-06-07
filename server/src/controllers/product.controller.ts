import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

class ProductController {
  listProducts = asyncHandler(async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
    const result = await productService.listProducts(req);
    res.json(ApiResponse.ok('Products fetched', result.data, result.meta));
  });

  listAllProductsForAdmin = asyncHandler(async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
    const result = await productService.adminListProducts(req);
    res.json(ApiResponse.ok('All products fetched', result.data, result.meta));
  });

  getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
    const product = await productService.getProductBySlug(req.params.slug as string);
    res.json(ApiResponse.ok('Product fetched', product));
  });

  getProductBySku = asyncHandler(async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
    const product = await productService.getProductBySku(req.params.sku as string);
    res.json(ApiResponse.ok('Product fetched', product));
  });

  getProductById = asyncHandler(async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
    const product = await productService.getProductById(req.params.id as string);
    res.json(ApiResponse.ok('Product fetched', product));
  });

  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json(ApiResponse.created('Product created', product));
  });

  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.updateProduct(req.params.id as string, req.body);
    res.json(ApiResponse.ok('Product updated', product));
  });

  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    await productService.deleteProduct(req.params.id as string);
    res.json(ApiResponse.ok('Product deleted'));
  });


}
export const productController = new ProductController();
