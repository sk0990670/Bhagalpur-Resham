import nodemailer from 'nodemailer';
import { logger } from '../config/logger';

class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    try {
      // For development, we use ethereal email. In production, provide actual SMTP config.
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

  async sendOrderConfirmation(email: string, orderDetails: any) {
    if (!this.transporter) {
      logger.warn('Email transporter not initialized');
      return;
    }

    const { orderId, pricing, shippingAddress, items } = orderDetails;

    const htmlContent = `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
        <h1 style="color: #800020;">Bhagalpur Resham</h1>
        <h2>Order Confirmation - ${orderId}</h2>
        <p>Dear ${shippingAddress.name},</p>
        <p>Thank you for your acquisition of Bhagalpur heritage. Your order has been confirmed.</p>
        
        <h3>Order Details</h3>
        <ul>
          ${items.map((i: any) => `<li>${i.name} (x${i.qty}) - ₹${i.total}</li>`).join('')}
        </ul>
        
        <p><strong>Subtotal:</strong> ₹${pricing.subtotal}</p>
        <p><strong>Shipping:</strong> ₹${pricing.shipping}</p>
        <p><strong>Tax (GST):</strong> ₹${pricing.tax}</p>
        <p><strong>Grand Total:</strong> ₹${pricing.total}</p>
        
        <h3>Shipping Address</h3>
        <p>
          ${shippingAddress.addressLine1}<br/>
          ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + '<br/>' : ''}
          ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}
        </p>
        
        <p>You will receive another email once your masterpiece has been dispatched.</p>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: '"Bhagalpur Resham" <orders@bhagalpurresham.com>',
        to: email,
        subject: `Order Confirmation - ${orderId}`,
        html: htmlContent,
      });
      logger.info(`Email sent: ${info.messageId}`);
      // For ethereal, log the URL to preview the email
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (err) {
      logger.error('Failed to send order confirmation email', err);
    }
  }
}

export const emailService = new EmailService();
