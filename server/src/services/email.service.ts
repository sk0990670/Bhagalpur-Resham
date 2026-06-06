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
    
    // ── Load Assets for Email ────────────────────────────────────────────────────────
    let leftSvgBuffer: Buffer | null = null;
    let rightSvgBuffer: Buffer | null = null;
    let logoBuffer: Buffer | null = null;
    
    try {
      const ROOT = path.join(__dirname, '../assets');
      if (fs.existsSync(path.join(ROOT, 'invoice-left.svg'))) {
        let leftSvg = fs.readFileSync(path.join(ROOT, 'invoice-left.svg'), 'utf-8');
        leftSvg = leftSvg.replace(/fill="#000000"/g, 'fill="#d4af37"').replace(/stroke="#000000"/g, 'stroke="#d4af37"');
        leftSvgBuffer = Buffer.from(leftSvg, 'utf-8');
      }
      if (fs.existsSync(path.join(ROOT, 'invoice-right.svg'))) {
        let rightSvg = fs.readFileSync(path.join(ROOT, 'invoice-right.svg'), 'utf-8');
        rightSvg = rightSvg.replace(/fill="#000000"/g, 'fill="#d4af37"').replace(/stroke="#000000"/g, 'stroke="#d4af37"');
        rightSvgBuffer = Buffer.from(rightSvg, 'utf-8');
      }
      if (fs.existsSync(path.join(ROOT, 'bhagalpur_resham_brand_logo.svg'))) {
        logoBuffer = fs.readFileSync(path.join(ROOT, 'bhagalpur_resham_brand_logo.svg'));
      } else if (fs.existsSync(path.join(ROOT, 'invoice-logo.png'))) {
        logoBuffer = fs.readFileSync(path.join(ROOT, 'invoice-logo.png'));
      }
    } catch (e) {
      logger.error('Failed to load email assets', e);
    }
    
    const bodyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #F8F4EE; -webkit-font-smoothing: antialiased;">
      <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fffaf0; padding: 0; border: 1px solid #eaddd7;">
        
        <!-- HEADER -->
        <div style="padding: 40px 30px; text-align: center; border-bottom: 2px solid #800020; background-color: #fffaf0;">
          ${logoBuffer ? `<img src="cid:brand-logo" alt="Bhagalpur Resham Logo" style="width: 80px; height: auto; margin-bottom: 15px;" />` : ''}
          <h1 style="color: #800020; margin: 0; font-size: 30px; font-family: 'Playfair Display', serif; font-weight: 700; line-height: 1.2;">Bhagalpur Resham</h1>
          <p style="color: #444444; margin: 8px 0 0 0; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Handwoven Heritage from Bhagalpur</p>
        </div>
        
        <!-- DECORATIVE BORDER -->
        <div style="text-align: center; padding: 20px 0; background-color: #ffffff;">
          ${leftSvgBuffer ? `<img src="cid:left-motif" style="width: 60px; height: auto; display: inline-block;" />` : ''}
          <span style="display: inline-block; width: 60px;"></span>
          ${rightSvgBuffer ? `<img src="cid:right-motif" style="width: 60px; height: auto; display: inline-block;" />` : ''}
        </div>
        
        <!-- THANK YOU MESSAGE -->
        <div style="padding: 10px 40px 40px 40px; background-color: #ffffff; color: #333333; text-align: center;">
          <h2 style="color: #800020; margin-top: 0; font-size: 24px; font-family: 'Playfair Display', serif; margin-bottom: 20px; font-weight: 700;">Thank You, ${orderDetails.shippingAddress.name}</h2>
          <p style="font-size: 15px; line-height: 1.7; color: #555555; font-family: 'Playfair Display', serif; font-style: italic;">Your handcrafted Bhagalpur silk masterpiece has entered our weaving journey. We are deeply honored by your patronage.</p>
          
          <!-- ORDER SUMMARY CARD -->
          <div style="background-color: #F8F4EE; border: 1px solid #eaddd7; border-radius: 8px; padding: 25px; margin: 35px 0; text-align: left;">
            <h3 style="color: #800020; font-family: 'Playfair Display', serif; font-size: 18px; margin-top: 0; margin-bottom: 15px; font-weight: 700; border-bottom: 1px solid #d4af37; padding-bottom: 10px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.8; font-family: 'Inter', sans-serif;">
              <tr>
                <td style="color: #555; width: 45%;"><strong>Order Number:</strong></td>
                <td style="color: #111;">${orderDetails.orderId}</td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Invoice Number:</strong></td>
                <td style="color: #111;">${orderDetails.invoiceNumber || 'Pending'}</td>
              </tr>
              <tr>
                <td style="color: #555; padding-top: 5px;"><strong>Grand Total:</strong></td>
                <td style="font-weight: 700; color: #800020; padding-top: 5px;">₹${orderDetails.pricing.total.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Payment Method:</strong></td>
                <td style="color: #111;">${orderDetails.paymentInfo?.method === 'razorpay' ? 'Razorpay (UPI)' : (orderDetails.paymentInfo?.method?.toUpperCase() || 'COD')}</td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Order Status:</strong></td>
                <td><span style="color: #2a7a2a; font-weight: 600;">Confirmed</span></td>
              </tr>
              <tr>
                <td style="color: #555;"><strong>Estimated Delivery:</strong></td>
                <td style="color: #111;">5 - 7 Business Days</td>
              </tr>
            </table>
          </div>

          ${imagePath ? `
          <div style="margin: 35px 0; text-align: center; border: 1px solid #eaddd7; padding: 15px; background-color: #F8F4EE; border-radius: 8px;">
            <p style="font-size: 14px; color: #800020; margin-top: 0; font-family: 'Playfair Display', serif; font-weight: 700; margin-bottom: 15px;">Invoice Preview</p>
            <img src="cid:invoice-preview" alt="Invoice Preview" style="max-width: 100%; height: auto; border: 1px solid #d4af37; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" />
          </div>
          ` : ''}

          <div style="margin-top: 40px; text-align: center; display: flex; flex-direction: column; gap: 15px;">
            <a href="${trackingLink}" style="display: block; background-color: #800020; color: #ffffff; text-decoration: none; padding: 14px 20px; font-weight: 600; border-radius: 4px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-family: 'Inter', sans-serif;">Track Order</a>
            <a href="${trackingLink}/invoice" style="display: block; background-color: transparent; border: 2px solid #800020; color: #800020; text-decoration: none; padding: 12px 20px; font-weight: 600; border-radius: 4px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-family: 'Inter', sans-serif;">Download Invoice</a>
            <a href="${continueShoppingLink}" style="display: block; color: #800020; text-decoration: underline; font-size: 14px; margin-top: 15px; font-family: 'Inter', sans-serif;">Continue Shopping</a>
          </div>
        </div>
        
        <!-- FOOTER -->
        <div style="background-color: #800020; padding: 35px 30px; text-align: center; color: #ffffff; font-family: 'Inter', sans-serif;">
          <h4 style="font-family: 'Playfair Display', serif; font-size: 18px; margin: 0 0 5px 0; color: #d4af37;">Bhagalpur Resham</h4>
          <p style="font-size: 11px; margin: 0 0 20px 0; color: #fce8cd; letter-spacing: 1px; text-transform: uppercase;">Preserving Tradition. Weaving Excellence.</p>
          
          <div style="font-size: 12px; line-height: 1.8; color: #fce8cd; border-top: 1px solid rgba(212,175,55,0.3); border-bottom: 1px solid rgba(212,175,55,0.3); padding: 15px 0; margin-bottom: 20px;">
            <p style="margin: 0;">www.bhagalpurresham.com</p>
            <p style="margin: 0;">support@bhagalpurresham.com | +91 70048 47226</p>
          </div>
          
          <p style="margin: 0; font-size: 10px; color: rgba(255,255,255,0.5);">&copy; ${new Date().getFullYear()} Bhagalpur Resham. All rights reserved.</p>
        </div>
      </div>
</body>
</html>
    `;

    const mailOptions: any = {
      from: '"Bhagalpur Resham" <orders@bhagalpurresham.com>',
      to: email,
      subject: `Your Bhagalpur Resham Order Confirmation – ${orderDetails.orderId}`,
      html: bodyHtml,
      attachments: []
    };

    if (logoBuffer) {
      mailOptions.attachments.push({
        filename: 'brand-logo.png',
        content: logoBuffer,
        cid: 'brand-logo'
      });
    }

    if (leftSvgBuffer) {
      mailOptions.attachments.push({
        filename: 'invoice-left.svg',
        content: leftSvgBuffer,
        contentType: 'image/svg+xml',
        cid: 'left-motif'
      });
    }

    if (rightSvgBuffer) {
      mailOptions.attachments.push({
        filename: 'invoice-right.svg',
        content: rightSvgBuffer,
        contentType: 'image/svg+xml',
        cid: 'right-motif'
      });
    }

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
