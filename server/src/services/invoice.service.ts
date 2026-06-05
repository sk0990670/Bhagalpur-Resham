import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { IOrder } from '../models/order.model';

export class InvoiceService {
  private async imgToBase64(filePath: string): Promise<string> {
    try {
      if (fsSync.existsSync(filePath)) {
        const buf = await fs.readFile(filePath);
        return `data:image/png;base64,${buf.toString('base64')}`;
      }
    } catch {}
    return '';
  }

  /** Read an SVG file and replace all black fills/strokes with the given color */
  private async readSvgColored(filePath: string, color: string): Promise<string> {
    try {
      if (fsSync.existsSync(filePath)) {
        let svg = await fs.readFile(filePath, 'utf-8');
        // Replace black fill and stroke with the brand color
        svg = svg.replace(/fill="#000000"/g,   `fill="${color}"`);
        svg = svg.replace(/stroke="#000000"/g, `stroke="${color}"`);
        // Add width/height constraints so it fits the layout
        svg = svg.replace(/<svg /, `<svg style="width:80px;height:80px;object-fit:contain;flex-shrink:0;" `);
        return svg;
      }
    } catch {}
    return '';
  }

  private async buildHtml(order: IOrder): Promise<string> {
    const ROOT = path.join(__dirname, '../assets');
    // Use the brand SVG logo inline (transparent background, no maroon box)
    const logoSvgB64 = await (async () => {
      try {
        if (fsSync.existsSync(path.join(ROOT, 'bhagalpur_resham_brand_logo.svg'))) {
          const buf = await fs.readFile(path.join(ROOT, 'bhagalpur_resham_brand_logo.svg'));
          return `data:image/svg+xml;base64,${buf.toString('base64')}`;
        }
      } catch {}
      // fallback to PNG if SVG not found
      return await this.imgToBase64(path.join(ROOT, 'invoice-logo.png'));
    })();
    // Gold (#D8A44A) on the cream background of the thank-you section
    const leftSvg   = await this.readSvgColored(path.join(ROOT, 'invoice-left.svg'),  '#D8A44A');
    const rightSvg  = await this.readSvgColored(path.join(ROOT, 'invoice-right.svg'), '#D8A44A');
    // Slightly deeper gold for the dark maroon footer strip
    const footerSvg = await this.readSvgColored(path.join(ROOT, 'invoice-left.svg'),  '#C8973A');

    const fmt = (d: Date) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const fmtTime = (d: Date) =>
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const createdAt = new Date(order.createdAt);
    const sgst   = (order.pricing.tax / 2).toFixed(2);
    const cgst   = (order.pricing.tax / 2).toFixed(2);
    const taxable = (order.pricing.subtotal - (order.pricing.couponDiscount || 0));

    const rows = order.items.map((item: any, i: number) => `
<tr>
  <td style="text-align:center;padding:8px 6px;border-right:1px solid #E5D4BC;">${i + 1}</td>
  <td style="padding:8px 6px;border-right:1px solid #E5D4BC;">
    <div style="display:flex;align-items:center;gap:8px;">
      ${item.image ? `<img src="${item.image}" crossorigin="anonymous" style="width:42px;height:52px;object-fit:cover;border:1px solid #eee;border-radius:2px;flex-shrink:0;" />` : ''}
      <div>
        <div style="font-weight:700;font-size:10.5px;color:#1a1a1a;font-family:'Playfair Display',serif;">${item.name}</div>
        <div style="font-size:8.5px;color:#777;margin-top:2px;">SKU: ${item.sku}</div>
      </div>
    </div>
  </td>
  <td style="text-align:center;padding:8px 6px;border-right:1px solid #E5D4BC;font-size:9px;">${item.sku}</td>
  <td style="text-align:center;padding:8px 6px;border-right:1px solid #E5D4BC;font-size:9px;">${item.color || 'Default'}</td>
  <td style="text-align:center;padding:8px 6px;border-right:1px solid #E5D4BC;font-size:9px;">${(item.weight || 500) * item.qty} g</td>
  <td style="text-align:center;padding:8px 6px;border-right:1px solid #E5D4BC;font-size:9px;">${item.qty}</td>
  <td style="text-align:center;padding:8px 6px;border-right:1px solid #E5D4BC;font-size:9px;">₹${item.price.toLocaleString('en-IN')}</td>
  <td style="text-align:center;padding:8px 6px;border-right:1px solid #E5D4BC;font-size:9px;">₹0</td>
  <td style="text-align:center;padding:8px 6px;font-size:9px;font-weight:700;">₹${item.total.toLocaleString('en-IN')}</td>
</tr>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice ${order.invoiceNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:#F8F4EE;color:#333;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .page{width:210mm;min-height:297mm;background:#F8F4EE;position:relative;}

  /* ── HEADER ── */
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;padding:22px 30px 16px;background:#F8F4EE;}
  .logo-wrap{display:flex;align-items:center;gap:14px;}
  .logo-container{background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;display:flex;align-items:center;flex-shrink:0;}
  .logo-container img{width:80px;height:auto;background:transparent!important;object-fit:contain;display:block;}
  .brand-block{display:flex;flex-direction:column;gap:2px;}
  .brand-name{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:#7A0E12;line-height:1;}
  .brand-tag{font-size:9.5px;letter-spacing:2.5px;text-transform:uppercase;color:#444;font-weight:600;margin-top:4px;}
  .brand-flourish{margin-top:8px;display:block;}

  .inv-meta{text-align:right;}
  .inv-label{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#7A0E12;letter-spacing:1px;text-transform:uppercase;}
  .inv-orig{font-size:10px;color:#777;margin-bottom:9px;}
  .inv-table{border-collapse:collapse;font-size:10.5px;margin-left:auto;}
  .inv-table td{padding:2px 0;}
  .inv-table .lbl{color:#444;padding-right:10px;}
  .inv-table .sep{padding-right:6px;color:#444;}
  .inv-table .val{font-weight:600;color:#111;}

  .divider{height:1px;background:rgba(122,14,18,.18);margin:0 28px;}

  /* ── INFO CARDS GRID ── */
  .main{padding:15px 30px;}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
  .card{background:#fff;border:1px solid #E5D4BC;border-radius:5px;padding:12px 14px;}
  .card-title{display:flex;align-items:center;gap:6px;color:#7A0E12;font-size:11px;font-weight:700;letter-spacing:.4px;margin-bottom:9px;}
  .card-title svg{width:14px;height:14px;stroke:#7A0E12;flex-shrink:0;}

  .info-grid{display:grid;grid-template-columns:94px 10px 1fr;row-gap:5px;font-size:10px;line-height:1.4;}
  .info-grid .k{color:#555;}
  .info-grid .s{color:#555;}
  .info-grid .v{font-weight:500;color:#111;}
  .v-red{color:#7A0E12!important;font-weight:700!important;font-size:10.5px!important;}
  .v-green{color:#2a7a2a!important;font-weight:700!important;}

  .addr-name{font-weight:700;font-size:11px;color:#111;margin-bottom:4px;}
  .addr-line{font-size:10px;line-height:1.55;color:#333;}

  /* ── PRODUCT TABLE ── */
  .ptable{width:100%;border-collapse:collapse;margin-bottom:14px;background:#fff;border:1px solid #E5D4BC;}
  .ptable thead tr{background:#7A0E12;}
  .ptable th{color:#fff;font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;padding:9px 7px;border-right:1px solid rgba(255,255,255,.2);}
  .ptable th:last-child{border-right:none;}
  .ptable tbody tr:nth-child(even){background:#FDFAF6;}

  /* ── BOTTOM GRID ── */
  .bottom{display:grid;grid-template-columns:1fr 285px;gap:12px;margin-bottom:14px;}
  .left-col{display:flex;flex-direction:column;gap:12px;}

  .why-list{list-style:none;padding:0;}
  .why-list li{display:flex;align-items:center;gap:6px;font-size:10px;color:#333;margin-bottom:6px;}
  .why-list li svg{width:12px;height:12px;stroke:#D8A44A;flex-shrink:0;}

  .pay-row{display:flex;justify-content:space-between;align-items:center;}
  .pay-via{font-size:10.5px;color:#333;margin-bottom:2px;}
  .pay-txn{font-size:9px;color:#777;}
  .pay-amt{font-size:15px;font-weight:700;color:#2a7a2a;}

  /* ── TOTALS TABLE ── */
  .ttable{width:100%;border-collapse:collapse;font-size:10.5px;background:#FDFAF6;border:1px solid #E5D4BC;}
  .ttable td{padding:5.5px 11px;color:#333;}
  .ttable td:last-child{text-align:right;font-weight:600;}
  .ttable .sep-row td{border-bottom:1px solid #E5D4BC;}
  .ttable .grand td{padding:8px 11px;background:rgba(216,164,74,.15);color:#7A0E12;font-weight:700;font-size:12.5px;border-top:1px solid #E5D4BC;border-bottom:1px solid #E5D4BC;}
  .ttable .paid td:last-child{color:#2a7a2a;font-weight:700;}
  .ttable .payable{background:rgba(122,14,18,.05);}
  .ttable .payable td{color:#7A0E12;font-weight:700;}

  /* ── THANK YOU ── */
  .ty{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fff;border:1px solid #E5D4BC;border-radius:5px;margin-bottom:14px;}
  .ty img{width:76px;height:76px;object-fit:contain;flex-shrink:0;}
  .ty-text{text-align:center;flex:1;padding:0 18px;}
  .ty-heading{font-size:11.5px;font-weight:700;color:#7A0E12;letter-spacing:.8px;text-transform:uppercase;margin-bottom:5px;}
  .ty-body{font-size:10px;color:#555;line-height:1.55;}

  /* ── CONTACT BAR ── */
  .cbar{display:flex;justify-content:space-between;padding:11px 30px;background:#fff;border-top:1px solid #E5D4BC;border-bottom:1px solid #E5D4BC;}
  .ci{display:flex;align-items:flex-start;gap:6px;}
  .ci svg{width:14px;height:14px;stroke:#333;flex-shrink:0;margin-top:1px;}
  .ci-title{font-size:8.5px;font-weight:700;color:#7A0E12;text-transform:uppercase;margin-bottom:2px;}
  .ci-body{font-size:8px;color:#333;line-height:1.55;}
  .socials{display:flex;gap:7px;margin-top:3px;}
  .socials svg{width:14px;height:14px;stroke:#7A0E12;}

  /* ── FOOTER ── */
  .foot{background:#7A0E12;color:#fff;font-size:8.5px;padding:8px 30px;display:flex;justify-content:space-between;align-items:center;}
  .foot-left{display:flex;align-items:center;gap:6px;}
  .foot-left svg{width:14px;height:14px;fill:#D8A44A;}
  .foot-right{padding-left:18px;border-left:1px solid rgba(255,255,255,.3);}
</style>
</head>
<body>
<div class="page">

<!-- HEADER -->
<div class="hdr">
  <div class="logo-wrap">
    <div class="logo-container">
      ${logoSvgB64 ? `<img src="${logoSvgB64}" alt="Bhagalpur Resham" />` : ''}
    </div>
    <div class="brand-block">
      <div class="brand-name">Bhagalpur Resham</div>
      <div class="brand-tag">Handwoven Heritage from Bhagalpur</div>
      <svg class="brand-flourish" width="200" height="14" viewBox="0 0 200 14">
        <line x1="0" y1="7" x2="82" y2="7" stroke="#D8A44A" stroke-width=".8"/>
        <circle cx="90" cy="7" r="1.5" fill="#D8A44A"/>
        <circle cx="100" cy="4" r="2.5" fill="none" stroke="#D8A44A" stroke-width=".8"/>
        <circle cx="100" cy="10" r="2.5" fill="none" stroke="#D8A44A" stroke-width=".8"/>
        <circle cx="110" cy="7" r="1.5" fill="#D8A44A"/>
        <line x1="118" y1="7" x2="200" y2="7" stroke="#D8A44A" stroke-width=".8"/>
      </svg>
    </div>
  </div>

  <div class="inv-meta">
    <div class="inv-label">INVOICE</div>
    <div class="inv-orig">Original for Recipient</div>
    <table class="inv-table">
      <tr><td class="lbl">Invoice No.</td><td class="sep">:</td><td class="val">${order.invoiceNumber}</td></tr>
      <tr><td class="lbl">Invoice Date</td><td class="sep">:</td><td class="val">${fmt(createdAt)}</td></tr>
      <tr><td class="lbl">Place of Supply</td><td class="sep">:</td><td class="val">${order.shippingAddress.state}</td></tr>
      <tr><td class="lbl">Reverse Charge</td><td class="sep">:</td><td class="val">No</td></tr>
    </table>
  </div>
</div>

<div class="divider"></div>

<div class="main">

  <!-- 2x2 INFO CARDS -->
  <div class="grid2">

    <!-- Order Details -->
    <div class="card">
      <div class="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
        ORDER DETAILS
      </div>
      <div class="info-grid">
        <div class="k">Order Number</div><div class="s">:</div><div class="v v-red">${order.orderId}</div>
        <div class="k">Order Date</div><div class="s">:</div><div class="v">${fmt(createdAt)}, ${fmtTime(createdAt)}</div>
        <div class="k">Payment Method</div><div class="s">:</div><div class="v">${order.paymentInfo?.method === 'razorpay' ? 'Razorpay (UPI)' : (order.paymentInfo?.method || 'COD')}</div>
        <div class="k">Payment Status</div><div class="s">:</div><div class="v v-green">Paid</div>
        <div class="k">Shipping Method</div><div class="s">:</div><div class="v">India Post Speed Post</div>
        <div class="k">Est. Delivery</div><div class="s">:</div><div class="v">5–7 Business Days</div>
      </div>
    </div>

    <!-- Billing Address -->
    <div class="card">
      <div class="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/><path d="M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4"/></svg>
        BILLING ADDRESS
      </div>
      <div class="addr-name">${order.shippingAddress.name}</div>
      <div class="addr-line">
        ${order.shippingAddress.addressLine1}<br>
        ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
        ${order.shippingAddress.city}, ${order.shippingAddress.state} – ${order.shippingAddress.pincode}<br>
        India
      </div>
      <div class="addr-line" style="margin-top:6px;">Phone: +91 ${order.shippingAddress.phone}</div>
    </div>

    <!-- Shipping Address -->
    <div class="card">
      <div class="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        SHIPPING ADDRESS
      </div>
      <div class="addr-name">${order.shippingAddress.name}</div>
      <div class="addr-line">
        ${order.shippingAddress.addressLine1}<br>
        ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
        ${order.shippingAddress.city}, ${order.shippingAddress.state} – ${order.shippingAddress.pincode}<br>
        India
      </div>
      <div class="addr-line" style="margin-top:6px;">Phone: +91 ${order.shippingAddress.phone}</div>
    </div>

    <!-- GST Information -->
    <div class="card">
      <div class="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
        GST INFORMATION
      </div>
      <div class="info-grid" style="grid-template-columns:46px 10px 1fr;">
        <div class="k">GSTIN</div><div class="s">:</div><div class="v">Not Applicable</div>
        <div class="k">PAN</div><div class="s">:</div><div class="v">Not Applicable</div>
      </div>
    </div>

  </div><!-- end .grid2 -->

  <!-- PRODUCT TABLE -->
  <table class="ptable">
    <thead>
      <tr>
        <th style="width:4%;text-align:center;">#</th>
        <th style="width:28%;">PRODUCT</th>
        <th style="width:11%;text-align:center;">SKU</th>
        <th style="width:9%;text-align:center;">COLOR</th>
        <th style="width:9%;text-align:center;">WEIGHT</th>
        <th style="width:5%;text-align:center;">QTY</th>
        <th style="width:12%;text-align:center;">UNIT PRICE</th>
        <th style="width:11%;text-align:center;">DISCOUNT</th>
        <th style="width:11%;text-align:center;">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- BOTTOM SECTION -->
  <div class="bottom">

    <div class="left-col">
      <!-- Why Bhagalpur Resham -->
      <div class="card">
        <div class="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          WHY BHAGALPUR RESHAM?
        </div>
        <ul class="why-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>100% Authentic Handloom</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Pure Silk &amp; Natural Zari</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Heritage Weaves from Bhagalpur</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Quality Assured</li>
        </ul>
      </div>

      <!-- Payment Summary -->
      <div class="card">
        <div class="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          PAYMENT SUMMARY
        </div>
        <div class="pay-row">
          <div>
            <div class="pay-via">Paid via ${order.paymentInfo?.method === 'razorpay' ? 'Razorpay (UPI)' : (order.paymentInfo?.method?.toUpperCase() || 'COD')}</div>
            <div class="pay-txn">Transaction ID: ${order.paymentInfo?.razorpayPaymentId || '-'}</div>
          </div>
          <div class="pay-amt">₹${order.pricing.total.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>

    <!-- Totals -->
    <div>
      <table class="ttable">
        <tr><td>Subtotal</td><td>₹${order.pricing.subtotal.toLocaleString('en-IN')}</td></tr>
        <tr><td>Discount</td><td>- ₹${(order.pricing.couponDiscount || 0).toLocaleString('en-IN')}</td></tr>
        <tr><td>Taxable Amount</td><td>₹${taxable.toLocaleString('en-IN')}</td></tr>
        <tr><td>SGST (2.5%)</td><td>₹${sgst}</td></tr>
        <tr class="sep-row"><td>CGST (2.5%)</td><td>₹${cgst}</td></tr>
        <tr><td>Shipping (India Post Speed Post)</td><td>₹${order.pricing.shipping.toLocaleString('en-IN')}</td></tr>
        <tr class="grand"><td>GRAND TOTAL</td><td>₹${order.pricing.total.toLocaleString('en-IN')}</td></tr>
        <tr class="paid"><td>Amount Paid</td><td>₹${order.pricing.total.toLocaleString('en-IN')}</td></tr>
        <tr class="payable"><td>Amount Payable</td><td>₹0</td></tr>
      </table>
    </div>

  </div><!-- end .bottom -->

  <!-- THANK YOU -->
  <div class="ty">
    ${leftSvg  || '<div style="width:80px;"></div>'}
    <div class="ty-text">
      <div class="ty-heading">THANK YOU FOR CHOOSING BHAGALPUR RESHAM</div>
      <div class="ty-body">Your support helps preserve the rich handloom heritage of Bhagalpur.<br>We hope you love your handcrafted treasure!</div>
    </div>
    ${rightSvg || '<div style="width:80px;"></div>'}
  </div>

</div><!-- end .main -->

<!-- CONTACT BAR -->
<div class="cbar">
  <div class="ci">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
    <div>
      <div class="ci-title">NEED HELP?</div>
      <div class="ci-body">We're here for you<br>+91 70048 47226<br>support@bhagalpurresham.com</div>
    </div>
  </div>

  <div class="ci">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    <div>
      <div class="ci-title">WEBSITE</div>
      <div class="ci-body">www.bhagalpurresham.com</div>
    </div>
  </div>

  <div class="ci">
    <div>
      <div class="ci-title">FOLLOW US</div>
      <div class="socials">
        <!-- Instagram -->
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        <!-- Facebook -->
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        <!-- Pinterest – correct "P" mark -->
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.5-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.29-1.96 3.29-4.79 0-2.51-1.8-4.26-4.37-4.26-2.98 0-4.72 2.23-4.72 4.54 0 .9.35 1.86.78 2.39.09.1.1.19.07.3-.08.33-.26 1.05-.3 1.2-.05.19-.17.23-.39.14-1.45-.68-2.36-2.8-2.36-4.51 0-3.67 2.67-7.04 7.69-7.04 4.04 0 7.18 2.88 7.18 6.72 0 4.01-2.53 7.24-6.03 7.24-1.18 0-2.29-.61-2.67-1.33l-.73 2.72c-.26 1.01-.97 2.27-1.45 3.04 1.09.34 2.25.52 3.44.52 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
      </div>
    </div>
  </div>

  <div class="ci">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
    <div>
      <div class="ci-title">ADDRESS</div>
      <div class="ci-body">Bhagalpur Resham<br>Bausi Road, Bhagalpur<br>Bihar – 812001, India</div>
    </div>
  </div>
</div>

<!-- FOOTER -->
<div class="foot">
  <div class="foot-left">
    <div style="width:22px;height:22px;flex-shrink:0;display:flex;align-items:center;">${footerSvg ? footerSvg.replace('style="width:80px;height:80px;object-fit:contain;flex-shrink:0;"', 'style="width:22px;height:22px;flex-shrink:0;"') : ''}</div>
    Preserving Tradition. Weaving Excellence.
  </div>
  <div class="foot-right">This is a computer generated invoice and does not require signature.</div>
</div>

</div><!-- end .page -->

<script>
Promise.all(
  Array.from(document.images)
    .filter(img=>!img.complete)
    .map(img=>new Promise(r=>{img.onload=img.onerror=r;}))
).then(()=>console.log('images ready'));
</script>
</body>
</html>`;
  }

  public async generateInvoice(order: IOrder): Promise<{ pdfPath: string; imagePath: string }> {
    if (!order.invoiceNumber) throw new Error('Missing invoiceNumber');

    const html = await this.buildHtml(order);

    const uploadsDir = path.join(process.cwd(), 'uploads', 'invoices');
    await fs.mkdir(uploadsDir, { recursive: true });

    const pdfFile = `${order.orderId}.pdf`;
    const pngFile = `${order.orderId}.png`;
    const pdfFull = path.join(uploadsDir, pdfFile);
    const pngFull = path.join(uploadsDir, pngFile);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

      // @ts-ignore  — networkidle0 ensures all remote (Cloudinary) images fully load
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

      // Extra wait for web fonts
      // @ts-ignore
      await page.evaluate(() => document.fonts.ready);

      // PDF — A4, no margins so our CSS page fills it perfectly
      await page.pdf({
        path: pdfFull,
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        preferCSSPageSize: false,
      });

      // PNG screenshot of the full .page element
      const el = await page.$('.page');
      if (el) {
        await el.screenshot({ path: pngFull });
      } else {
        await page.screenshot({ path: pngFull, fullPage: true });
      }
    } finally {
      await browser.close();
    }

    return {
      pdfPath:   `/uploads/invoices/${pdfFile}`,
      imagePath: `/uploads/invoices/${pngFile}`,
    };
  }
}

export const invoiceService = new InvoiceService();
