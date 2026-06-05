import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { ApiError } from '../utils/ApiError';
import path from 'path';
import fs from 'fs';
import { logger } from '../config/logger';

class InvoiceController {
  
  // GET /api/invoices/:orderId
  public getInvoice = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const user = (req as any).user;
      
      const order = await orderService.getOrderById(orderId as string, user.userId as string, user.role as string);
      
      if (!order.invoiceNumber) {
        throw ApiError.notFound('Invoice has not been generated for this order yet');
      }

      res.status(200).json({
        success: true,
        data: {
          invoiceNumber: order.invoiceNumber,
          orderId: order.orderId,
          invoicePdfUrl: order.invoicePdfUrl,
          invoiceImageUrl: order.invoiceImageUrl,
          pricing: order.pricing,
          paymentInfo: order.paymentInfo,
          customer: order.shippingAddress,
          createdAt: order.createdAt
        }
      });
    } catch (error: any) {
      logger.error('Error fetching invoice', error);
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  };

  // GET /api/invoices/:orderId/download
  public downloadInvoice = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const user = (req as any).user;
      
      const order = await orderService.getOrderById(orderId as string, user.userId as string, user.role as string);
      
      if (!order.invoicePdfUrl) {
        throw ApiError.notFound('Invoice PDF not found for this order');
      }

      const filePath = path.join(process.cwd(), order.invoicePdfUrl);
      
      if (!fs.existsSync(filePath)) {
        throw ApiError.notFound('Invoice PDF file is missing on the server');
      }

      res.download(filePath, `Invoice-${order.orderId}.pdf`, (err) => {
        if (err) {
          logger.error('Error downloading invoice file', err);
          if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Failed to download file' });
          }
        }
      });
    } catch (error: any) {
      logger.error('Error downloading invoice', error);
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  };

}

export const invoiceController = new InvoiceController();
