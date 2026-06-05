import PDFDocument from 'pdfkit';

export class PdfService {
  async generateInvoice(order: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });

        // Header
        doc
          .fillColor('#800020')
          .fontSize(28)
          .text('Bhagalpur Resham', { align: 'center' })
          .fontSize(10)
          .fillColor('#5c4a47')
          .text('Handwoven Heritage from Bhagalpur', { align: 'center' })
          .moveDown(2);

        // Invoice Info
        doc
          .fillColor('#000000')
          .fontSize(20)
          .text('TAX INVOICE', { align: 'right' })
          .fontSize(10)
          .text(`Invoice No: INV-${order.orderId}`, { align: 'right' })
          .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'right' })
          .moveDown(2);

        // Customer Details
        doc.fontSize(12).fillColor('#800020').text('Billed To:');
        doc.fillColor('#000000').fontSize(10)
          .text(order.shippingAddress.name)
          .text(order.shippingAddress.addressLine1)
          .text(order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 : '')
          .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`)
          .text(`Phone: ${order.shippingAddress.phone}`)
          .moveDown(2);

        // Table Header
        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Qty', 300, tableTop);
        doc.text('Price', 350, tableTop);
        doc.text('Total', 450, tableTop, { align: 'right' });

        // Table Divider
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
        doc.font('Helvetica');

        let yPosition = tableTop + 25;

        // Table Rows
        order.items.forEach((item: any) => {
          doc.text(item.product?.name || 'Handwoven Product', 50, yPosition);
          doc.text(item.qty.toString(), 300, yPosition);
          doc.text(`Rs ${item.price}`, 350, yPosition);
          doc.text(`Rs ${item.total}`, 450, yPosition, { align: 'right' });
          yPosition += 20;
        });

        doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
        yPosition += 15;

        // Pricing Breakdown
        doc.font('Helvetica-Bold');
        doc.text('Subtotal:', 350, yPosition);
        doc.text(`Rs ${order.pricing.subtotal}`, 450, yPosition, { align: 'right' });
        yPosition += 20;

        if (order.pricing.shipping > 0) {
          doc.text('Shipping:', 350, yPosition);
          doc.text(`Rs ${order.pricing.shipping}`, 450, yPosition, { align: 'right' });
          yPosition += 20;
        }

        doc.text('GST (Included):', 350, yPosition);
        doc.text(`Rs ${order.pricing.tax}`, 450, yPosition, { align: 'right' });
        yPosition += 20;

        doc.fillColor('#800020');
        doc.text('Grand Total:', 350, yPosition);
        doc.text(`Rs ${order.pricing.total}`, 450, yPosition, { align: 'right' });

        // Footer
        doc
          .fillColor('#5c4a47')
          .fontSize(10)
          .font('Helvetica')
          .text(
            'This is a computer generated invoice and does not require a physical signature.',
            50,
            doc.page.height - 50,
            { align: 'center' }
          );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const pdfService = new PdfService();
