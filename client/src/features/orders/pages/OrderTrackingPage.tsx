import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../shared/services/api';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="flex-grow pt-[40px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full madhubani-motif flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex-grow pt-[40px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full madhubani-motif">
        <div className="text-center py-20 bg-surface-container-lowest rounded-lg border border-outline-variant/30 max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">error</span>
          <h2 className="font-headline-sm text-primary mb-2">Order Not Found</h2>
          <p className="text-on-surface-variant mb-6">We couldn't locate tracking details for this order.</p>
          <Link to="/order-history" className="px-6 py-3 bg-primary text-on-primary font-label-caps uppercase hover:bg-primary-container transition-colors cursor-pointer">Back to History</Link>
        </div>
      </main>
    );
  }

  const primaryImage = order.items[0]?.image;
  
  const getActiveStep = (status: string, stage?: string) => {
    if (status === 'pending_verification' || status === 'payment_failed') return 1;
    if (status === 'confirmed') return 2;
    if (status === 'in_production') {
      switch(stage) {
        case 'assigned': return 2;
        case 'yarn_preparation': return 3;
        case 'dyeing': return 4;
        case 'weaving': return 5;
        case 'finishing': return 6;
        case 'quality_check': return 7;
        case 'ready_for_dispatch': return 8;
        default: return 5;
      }
    }
    if (status === 'ready_for_shipping') return 8;
    if (status === 'shipped') return 9;
    if (status === 'delivered') return 10;
    if (status === 'cancelled') return -1;
    return 1;
  };

  const activeStep = getActiveStep(order.status, order.productionStage);
  const isCancelled = order.status === 'cancelled';

  return (
    <main className="flex-grow pt-[40px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full madhubani-motif">
      {/* Header Section */}
      <header className="text-center mb-16 pt-12">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Track Your Heritage Piece</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">
          Follow the journey of your authentic Bhagalpur silk masterpiece from the looms of our artisans to your doorstep.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Timeline Canvas */}
        <div className="lg:col-span-8 space-y-8">
          {/* Order Details Card */}
          <div className="ornamental-border textural-shadow bg-surface-bright rounded">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-6">
              <div>
                <span className="font-label-caps text-label-caps text-secondary block mb-1">ORDER ID</span>
                <span className="font-headline-md text-headline-md text-primary">#{order.orderId}</span>
              </div>
              <div className="text-right">
                <span className="font-label-caps text-label-caps text-secondary block mb-1">DATE PLACED</span>
                <span className="font-body-md text-body-md text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            {/* The Timeline */}
            <div className="relative pl-8 border-l-2 border-outline-variant ml-4 space-y-12 py-4">
              
              {isCancelled && (
                 <div className="relative">
                   <div className="absolute -left-[43px] w-6 h-6 bg-error-container border-2 border-error rounded-full flex items-center justify-center">
                     <span className="material-symbols-outlined text-[14px] text-error">close</span>
                   </div>
                   <h3 className="font-body-lg text-body-lg text-error mb-1">Order Cancelled</h3>
                   <p className="font-body-md text-body-md text-on-surface-variant">Your order has been cancelled.</p>
                 </div>
              )}

              {/* Step 1: Pending */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute -left-[43px] w-6 h-6 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-surface-container-highest border-2 border-secondary' : 'bg-surface border-2 border-outline'}`}>
                    {activeStep > 1 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 1 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 1 ? 'text-primary font-bold' : (activeStep > 1 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Pending</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {activeStep >= 1 ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'PENDING'}
                  </p>
                </div>
              )}

              {/* Step 2: Confirmed */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 2 ? '-left-[45px] w-7 h-7 bg-primary-container border-2 border-primary-container ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center`}>
                    {activeStep > 2 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 2 ? <span className="material-symbols-outlined text-[16px] text-on-primary">thumb_up</span> : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 2 ? 'text-primary font-bold' : (activeStep > 2 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Confirmed</h3>
                  <p className="font-label-caps text-label-caps text-outline">{activeStep > 2 ? 'COMPLETED' : (activeStep === 2 ? 'PAYMENT RECEIVED' : 'PENDING')}</p>
                </div>
              )}

              {/* STAGE 3: Yarn Preparation */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 3 ? '-left-[45px] w-7 h-7 bg-primary-container border-2 border-primary-container ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center`}>
                    {activeStep > 3 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 3 ? <span className="material-symbols-outlined text-[16px] text-on-primary">texture</span> : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 3 ? 'text-primary font-bold' : (activeStep > 3 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Yarn Preparation</h3>
                  {activeStep === 3 ? (
                    <div className="mt-2 p-3 bg-surface-container-low border border-outline-variant/50 rounded-sm">
                      <p className="font-body-md text-body-md text-on-surface italic">"The finest Ahimsa silk threads are being prepared and spun."</p>
                    </div>
                  ) : (
                    <p className="font-label-caps text-label-caps text-outline">{activeStep > 3 ? 'COMPLETED' : 'PENDING'}</p>
                  )}
                </div>
              )}

              {/* STAGE 4: Dyeing (Optional, mapped to 4) */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 4 ? '-left-[45px] w-7 h-7 bg-primary-container border-2 border-primary-container ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center`}>
                    {activeStep > 4 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 4 ? <span className="material-symbols-outlined text-[16px] text-on-primary">palette</span> : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 4 ? 'text-primary font-bold' : (activeStep > 4 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Dyeing & Natural Colors</h3>
                  {activeStep === 4 ? (
                    <div className="mt-2 p-3 bg-surface-container-low border border-outline-variant/50 rounded-sm">
                      <p className="font-body-md text-body-md text-on-surface italic">"Dyeing the threads with natural and organic colors."</p>
                    </div>
                  ) : (
                    <p className="font-label-caps text-label-caps text-outline">{activeStep > 4 ? 'COMPLETED' : 'PENDING'}</p>
                  )}
                </div>
              )}

              {/* Step 5: Weaving Started */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 5 ? '-left-[47px] w-8 h-8 bg-[#8B0000] text-white ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center overflow-hidden`}>
                    {activeStep > 5 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 5 ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="font-bold text-[14px] leading-none tracking-tighter" style={{ fontFamily: 'sans-serif' }}>S</span>
                        <span className="material-symbols-outlined text-[14px] leading-none -ml-[2px] mt-[1px]">pool</span>
                      </div>
                    ) : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 5 ? 'text-primary font-bold' : (activeStep > 5 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Weaving Started</h3>
                  {activeStep === 5 ? (
                    <div className="mt-2">
                      <p className="font-body-md text-body-md text-on-surface-variant mb-3 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">brush</span> 
                        Artisan: {order.assignedArtisan?.name || order.assignedArtisan || 'Master Artisan'}
                      </p>
                      <div className="p-3 bg-surface-container-low border border-outline-variant/50 rounded-sm">
                        <p className="font-body-md text-body-md text-on-surface italic">"The warp is set, and the rhythmic clack of the loom begins to shape your silk."</p>
                      </div>
                    </div>
                  ) : (
                    <p className="font-label-caps text-label-caps text-outline">{activeStep > 5 ? 'COMPLETED' : 'PENDING'}</p>
                  )}
                </div>
              )}

              {/* Step 6: Finishing */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 6 ? '-left-[45px] w-7 h-7 bg-primary-container border-2 border-primary-container ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center`}>
                    {activeStep > 6 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 6 ? <span className="material-symbols-outlined text-[16px] text-on-primary">auto_fix_high</span> : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 6 ? 'text-primary font-bold' : (activeStep > 6 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Finishing & Polishing</h3>
                  {activeStep === 6 ? (
                    <div className="mt-2 p-3 bg-surface-container-low border border-outline-variant/50 rounded-sm">
                      <p className="font-body-md text-body-md text-on-surface italic">"Hand-rolled hems and finishing touches are being applied."</p>
                    </div>
                  ) : (
                    <p className="font-label-caps text-label-caps text-outline">{activeStep > 6 ? 'COMPLETED' : 'PENDING'}</p>
                  )}
                </div>
              )}

              {/* Step 7: Quality Check & Certification */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 7 ? '-left-[45px] w-7 h-7 bg-primary-container border-2 border-primary-container ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center`}>
                    {activeStep > 7 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 7 ? <span className="material-symbols-outlined text-[16px] text-on-primary">verified</span> : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 7 ? 'text-primary font-bold' : (activeStep > 7 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Quality Check & Certification</h3>
                  {activeStep === 7 ? (
                    <div className="mt-2 p-3 bg-surface-container-low border border-outline-variant/50 rounded-sm">
                      <p className="font-body-md text-body-md text-on-surface italic">"Your piece is undergoing strict quality and Silk Mark certification."</p>
                    </div>
                  ) : (
                    <p className="font-label-caps text-label-caps text-outline">{activeStep > 7 ? 'COMPLETED' : 'PENDING'}</p>
                  )}
                </div>
              )}

              {/* Step 8: Ready for Dispatch */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 8 ? '-left-[45px] w-7 h-7 bg-primary-container border-2 border-primary-container ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center`}>
                    {activeStep > 8 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 8 ? <span className="material-symbols-outlined text-[16px] text-on-primary">inventory_2</span> : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 8 ? 'text-primary font-bold' : (activeStep > 8 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Ready for Dispatch</h3>
                  {activeStep === 8 ? (
                    <div className="mt-2 p-3 bg-surface-container-low border border-outline-variant/50 rounded-sm">
                      <p className="font-body-md text-body-md text-on-surface italic">"Packed securely and waiting for courier pickup."</p>
                    </div>
                  ) : (
                    <p className="font-label-caps text-label-caps text-outline">{activeStep > 8 ? 'COMPLETED' : 'PENDING'}</p>
                  )}
                </div>
              )}

              {/* Step 9: Shipped */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 9 ? '-left-[45px] w-7 h-7 bg-primary-container border-2 border-primary-container ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center`}>
                    {activeStep > 9 ? <span className="material-symbols-outlined text-[14px] text-secondary">check</span> : (activeStep === 9 ? <span className="material-symbols-outlined text-[16px] text-on-primary">local_shipping</span> : null)}
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 9 ? 'text-primary font-bold' : (activeStep > 9 ? 'text-on-surface' : 'text-on-surface-variant')}`}>Shipped</h3>
                  {activeStep >= 9 ? (
                    <div className="mt-2">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        <strong>Courier:</strong> {order.courierName || 'BlueDart'}
                      </p>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        <strong>Tracking Number:</strong> {order.trackingNumber || 'Awaiting update'}
                      </p>
                      {order.shippingDate && (
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          <strong>Shipped On:</strong> {new Date(order.shippingDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-label-caps text-label-caps text-outline">PENDING</p>
                  )}
                </div>
              )}

              {/* Step 10: Delivered */}
              {!isCancelled && (
                <div className="relative">
                  <div className={`absolute ${activeStep === 10 ? '-left-[45px] w-7 h-7 bg-green-100 border-2 border-green-200 ring-4 ring-surface' : '-left-[43px] w-6 h-6 bg-surface border-2 border-outline'} rounded-full flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${activeStep === 10 ? 'text-[16px] text-green-700' : 'text-[14px] text-outline'}`}>redeem</span>
                  </div>
                  <h3 className={`font-body-lg text-body-lg mb-1 ${activeStep === 10 ? 'text-green-700 font-bold' : 'text-on-surface-variant'}`}>Delivered</h3>
                  {activeStep === 10 ? (
                    <div className="mt-2">
                      <p className="font-body-md text-body-md text-green-800">Your Bhagalpur Resham order has been delivered.</p>
                      {order.deliveredAt && (
                        <p className="font-body-md text-body-md text-green-700 mt-1">
                          <strong>Delivered On:</strong> {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-label-caps text-label-caps text-outline">PENDING</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-surface-container-low p-8 rounded-sm text-center border border-outline-variant/30 textural-shadow">
            <h3 className="font-headline-md text-headline-md text-primary mb-2">Need Assistance?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Our concierges are available to answer any questions about your order.</p>
            <a 
              href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'sk0990670@gmail.com'}?subject=Assistance with Order ${order.orderId}`}
              className="bg-primary-container text-secondary-fixed font-label-caps text-label-caps px-8 py-3 rounded hover:bg-primary transition-colors inline-flex items-center justify-center mx-auto gap-2 group cursor-pointer"
            >
              CONTACT US
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Sidebar / Summary */}
        <div className="lg:col-span-4">
          <div className="ornamental-border textural-shadow bg-surface-bright rounded sticky top-[120px]">
            <div className="mb-4 bg-surface-variant flex items-center justify-center h-[420px] rounded-sm border border-outline-variant/50 overflow-hidden">
              {primaryImage ? (
                <img alt={order.items[0]?.name} className="w-full h-full object-cover" src={primaryImage} />
              ) : (
                <span className="material-symbols-outlined text-4xl opacity-50">image</span>
              )}
            </div>
            <div className="text-center">
              <h4 className="font-headline-md text-headline-md text-on-surface mb-2 px-4 line-clamp-2">{order.items[0]?.name}</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4 px-4">{order.items[0]?.weaveType || 'Handwoven Heritage Saree'}</p>
              
              {order.items.length > 1 && (
                 <p className="font-body-sm text-secondary mb-4 italic">+ {order.items.length - 1} more items</p>
              )}

              <p className="font-label-caps text-label-caps text-secondary mb-6">SILK MARK CERTIFIED</p>
              <Link className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors inline-block cursor-pointer" to="/order-history">
                VIEW ORDER HISTORY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderTracking;
