import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger';

class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info('Ethereal Email transport configured for testing.');
    } catch (err) {
      logger.error('Failed to configure email transport', err);
    }
  }

  private getBaseTemplate(title: string, body: string, orderId: string) {
    const trackingLink = `${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/orders/${orderId}`;
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fffaf0; padding: 0;">
        <div style="background-color: #800020; padding: 30px; text-align: center; border-bottom: 4px solid #d4af37;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">Bhagalpur Resham</h1>
          <p style="color: #fce8cd; margin: 10px 0 0 0; font-size: 14px; font-style: italic;">Handwoven Heritage from Bhagalpur</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #800020; margin-top: 0; font-size: 22px; border-bottom: 1px solid #eeeeee; padding-bottom: 15px;">${title}</h2>
          ${body}
          
          <div style="margin-top: 40px; text-align: center;">
            <a href="${trackingLink}" style="display: inline-block; background-color: #d4af37; color: #800020; text-decoration: none; padding: 14px 28px; font-weight: bold; border-radius: 4px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Track My Order</a>
          </div>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee; color: #777777; font-size: 12px;">
          <p style="margin: 0;">Need help? Reply to this email or contact <a href="mailto:support@bhagalpurresham.com" style="color: #800020;">support@bhagalpurresham.com</a></p>
          <p style="margin: 10px 0 0 0;">&copy; ${new Date().getFullYear()} Bhagalpur Resham. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  private generateOrderSummaryHtml(order: any) {
    const itemsHtml = order.items.map((i: any) => `
      <tr>
        <td style="padding: 15px 10px; border-bottom: 1px solid #eeeeee;">
          <div style="font-weight: bold; color: #333333;">${i.product?.name || 'Handwoven Product'}</div>
          <div style="font-size: 12px; color: #777777; margin-top: 4px;">SKU: ${i.product?.sku || 'N/A'} | Qty: ${i.qty}</div>
        </td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold; color: #800020;">
          ₹${i.total}
        </td>
      </tr>
    `).join('');

    return `
      <table style="width: 100%; border-collapse: collapse; margin-top: 25px; margin-bottom: 25px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 10px; border-bottom: 2px solid #800020; color: #800020; font-size: 14px; text-transform: uppercase;">Product</th>
            <th style="text-align: right; padding: 10px; border-bottom: 2px solid #800020; color: #800020; font-size: 14px; text-transform: uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="text-align: right; padding: 10px; font-size: 14px; color: #555555;">Subtotal:</td>
            <td style="text-align: right; padding: 10px; font-weight: bold;">₹${order.pricing.subtotal}</td>
          </tr>
          ${order.pricing.shipping > 0 ? `
          <tr>
            <td style="text-align: right; padding: 10px; font-size: 14px; color: #555555;">Shipping:</td>
            <td style="text-align: right; padding: 10px; font-weight: bold;">₹${order.pricing.shipping}</td>
          </tr>` : ''}
          <tr>
            <td style="text-align: right; padding: 10px; font-size: 14px; color: #555555;">GST (Included):</td>
            <td style="text-align: right; padding: 10px; font-weight: bold;">₹${order.pricing.tax}</td>
          </tr>
          <tr>
            <td style="text-align: right; padding: 15px 10px; font-size: 16px; font-weight: bold; color: #800020; border-top: 2px solid #800020;">Grand Total:</td>
            <td style="text-align: right; padding: 15px 10px; font-size: 16px; font-weight: bold; color: #800020; border-top: 2px solid #800020;">₹${order.pricing.total}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background-color: #fdfbf7; padding: 20px; border: 1px solid #eaddd7; border-radius: 4px; margin-top: 30px;">
        <h3 style="color: #800020; margin-top: 0; font-size: 16px;">Delivery Details</h3>
        <p style="margin: 0; line-height: 1.6; color: #555555;">
          <strong>${order.shippingAddress.name}</strong><br>
          ${order.shippingAddress.addressLine1}<br>
          ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
          Phone: ${order.shippingAddress.phone}
        </p>
      </div>
    `;
  }

  async sendOrderConfirmation(email: string, orderDetails: any, pdfPath?: string, imagePath?: string) {
    if (!this.transporter) return;

    const frontendUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
    const trackingLink = `${frontendUrl}/orders/${orderDetails.orderId}`;
    const continueShoppingLink = `${frontendUrl}/collections`;
    
    // We'll build a custom HTML just for Order Confirmation to match the exact requirements
    const bodyHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fffaf0; padding: 0; border: 1px solid #eaddd7;">
        <div style="background-color: #800020; padding: 30px; text-align: center; border-bottom: 4px solid #d4af37;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">Bhagalpur Resham</h1>
          <p style="color: #fce8cd; margin: 10px 0 0 0; font-size: 14px; font-style: italic;">Handwoven Heritage from Bhagalpur</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #800020; margin-top: 0; font-size: 22px; text-align: center; margin-bottom: 20px;">Thank you for your patronage!</h2>
          <p style="font-size: 16px; line-height: 1.6;">Dear ${orderDetails.shippingAddress.name},</p>
          <p style="font-size: 16px; line-height: 1.6;">We have successfully received your order. Our artisans are preparing your handcrafted masterpiece.</p>
          
          <div style="background-color: #fdfbf7; border-left: 4px solid #d4af37; padding: 15px; margin: 25px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.8;">
              <tr>
                <td style="color: #555; width: 40%;"><strong>Order Number:</strong></td>
                <td>${orderDetails.orderId}</td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Invoice Number:</strong></td>
                <td>${orderDetails.invoiceNumber || 'Pending'}</td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Grand Total:</strong></td>
                <td style="font-weight: bold; color: #800020;">₹${orderDetails.pricing.total.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Payment Method:</strong></td>
                <td>${orderDetails.paymentInfo?.method.toUpperCase()}</td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Order Status:</strong></td>
                <td><span style="color: #2e7d32; font-weight: bold;">Confirmed</span></td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Estimated Delivery:</strong></td>
                <td>5 - 7 Business Days</td>
              </tr>
            </table>
          </div>

          ${imagePath ? `
          <div style="margin: 30px 0; text-align: center; border: 1px solid #eaddd7; padding: 10px; background-color: #f9f9f9;">
            <p style="font-size: 12px; color: #777; margin-top: 0;">Invoice Preview</p>
            <img src="cid:invoice-preview" alt="Invoice Preview" style="max-width: 100%; height: auto; border: 1px solid #ccc; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
          </div>
          ` : ''}

          <div style="margin-top: 40px; text-align: center; display: flex; flex-direction: column; gap: 15px;">
            <a href="${trackingLink}" style="display: block; background-color: #800020; color: #ffffff; text-decoration: none; padding: 14px 20px; font-weight: bold; border-radius: 4px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Track Order</a>
            <a href="${trackingLink}/invoice" style="display: block; background-color: transparent; border: 2px solid #800020; color: #800020; text-decoration: none; padding: 12px 20px; font-weight: bold; border-radius: 4px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Download Invoice</a>
            <a href="${continueShoppingLink}" style="display: block; color: #800020; text-decoration: underline; font-size: 14px; margin-top: 10px;">Continue Shopping</a>
          </div>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee; color: #777777; font-size: 12px;">
          <p style="margin: 0;">Need help? Reply to this email or contact <a href="mailto:support@bhagalpurresham.com" style="color: #800020;">support@bhagalpurresham.com</a></p>
          <p style="margin: 10px 0 0 0;">&copy; ${new Date().getFullYear()} Bhagalpur Resham. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions: any = {
      from: '"Bhagalpur Resham" <orders@bhagalpurresham.com>',
      to: email,
      subject: `Your Bhagalpur Resham Order Confirmation – ${orderDetails.orderId}`,
      html: bodyHtml,
      attachments: []
    };

    if (pdfPath && fs.existsSync(pdfPath)) {
      mailOptions.attachments.push({
        filename: `Invoice-${orderDetails.orderId}.pdf`,
        path: pdfPath,
        contentType: 'application/pdf'
      });
    }

    if (imagePath && fs.existsSync(imagePath)) {
      mailOptions.attachments.push({
        filename: `Invoice-${orderDetails.orderId}.png`,
        path: imagePath,
        cid: 'invoice-preview',
        contentType: 'image/png'
      });
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Order Confirmation Email sent: ${info.messageId} | Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (err) {
      logger.error('Failed to send order confirmation email', err);
    }
  }

  async sendStatusUpdateEmail(email: string, orderDetails: any, newStatus: string) {
    if (!this.transporter) return;

    let statusMessage = '';
    let title = 'Order Update';

    switch (newStatus) {
      case 'processing':
        title = 'Your Order is Being Processed';
        statusMessage = 'Your order is currently on the loom. Our artisans are working meticulously on your masterpiece.';
        break;
      case 'shipped':
        title = 'Your Order Has Been Dispatched';
        statusMessage = `Your masterpiece has left our workshop and is on its way to you. ${orderDetails.trackingNumber ? `Your tracking number is <strong>${orderDetails.trackingNumber}</strong>.` : ''}`;
        break;
      case 'delivered':
        title = 'Your Order Has Been Delivered';
        statusMessage = 'Your handwoven heritage has arrived. We hope it brings you joy and elegance.';
        break;
      case 'cancelled':
        title = 'Your Order Has Been Cancelled';
        statusMessage = 'Your order has been cancelled as requested or due to an issue. Please contact support for any questions.';
        break;
      case 'refunded':
        title = 'Refund Issued';
        statusMessage = 'A refund has been issued for your cancelled order. It should reflect in your account shortly.';
        break;
      default:
        title = `Order Status: ${newStatus.toUpperCase()}`;
        statusMessage = `The status of your order has been updated to <strong>${newStatus.toUpperCase()}</strong>.`;
    }

    const body = `
      <p style="font-size: 16px; line-height: 1.6;">Dear ${orderDetails.shippingAddress.name},</p>
      <p style="font-size: 16px; line-height: 1.6;">${statusMessage}</p>
      <p style="font-size: 16px; line-height: 1.6;"><strong>Order Number:</strong> ${orderDetails.orderId}</p>
    `;

    const htmlContent = this.getBaseTemplate(title, body, orderDetails.orderId);

    try {
      const info = await this.transporter.sendMail({
        from: '"Bhagalpur Resham" <orders@bhagalpurresham.com>',
        to: email,
        subject: `${title} - ${orderDetails.orderId}`,
        html: htmlContent,
      });
      logger.info(`Status Update Email sent: ${info.messageId} | Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (err) {
      logger.error('Failed to send status update email', err);
    }
  }
}

export const emailService = new EmailService();
