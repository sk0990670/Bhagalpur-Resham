import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const state = location.state as { orderId?: string; estimatedDelivery?: string; shippingPaid?: number; codAmount?: number } | undefined;

  const orderId = state?.orderId || '#BR-99021';
  
  // Format estimated delivery date if available
  const formattedDelivery = state?.estimatedDelivery 
    ? new Intl.DateTimeFormat('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(state.estimatedDelivery))
    : '5-7 Business Days';

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto w-full">
      {/* Celebratory Section */}
      <div className="text-center max-w-2xl mb-[64px]">
        <h1 className="font-display-lg text-display-lg text-primary mb-[24px] max-md:font-display-lg-mobile max-md:text-display-lg-mobile">
          Thank You.
        </h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant mb-[48px]">
          Your acquisition of Bhagalpur heritage is confirmed. The loom now weaves your legacy.
        </p>
        
        {/* Madhubani Artwork Divider */}
        <div className="flex justify-center items-center gap-4 mb-[48px] opacity-80">
          <span className="h-px bg-outline-variant w-24"></span>
          <img 
            alt="Ornamental divider" 
            className="h-10 object-contain mix-blend-multiply filter grayscale opacity-60" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgQA2SDhCCeG0jLfFOt5oMzMFakPHbI0sDc34WDS1tQ_T_5Nkc2LJM_zlc1yZ5zJ7ut_4kpIwO2yCaXzb2ZiZ0Pz5FQzyGU-FA2iF9q2xdOoVlVm5fh2bC_vVxOuZ-xpv99gqcM6XIcAznPM3eKIuHEIG0mQ7CosS6tM-78OfLhSUV6iXE5kbS-p6RWc8xUc6AbkRWmjy_zwhBEIgO4JhOTHgUKKieE2wHfMCvzjKC4RDzoZFGwkRQHL8APNsKFpWVIBNRLHIRj31-" 
          />
          <span className="h-px bg-outline-variant w-24"></span>
        </div>
        
        {/* Order Details */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-gutter text-on-surface">
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline mb-1">Order Number</span>
            <span className="font-headline-md text-headline-md text-primary">{orderId}</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-outline-variant"></div>
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline mb-1">Estimated Delivery</span>
            <span className="font-body-lg text-body-lg text-on-surface-variant mt-1">{formattedDelivery}</span>
          </div>
        </div>
      </div>

      {/* The "Masterpiece" Product Summary Card */}
      <div className="w-full max-w-3xl bg-surface-container-lowest p-[16px] tinted-shadow mb-[64px]">
        <div className="border border-secondary-container p-[24px] flex flex-col md:flex-row gap-[32px] items-center md:items-start relative">
          {/* Artisan Badge */}
          <div className="absolute top-[16px] left-[16px] z-10 bg-surface-container-lowest rounded-full p-2 border border-secondary-container tinted-shadow" title="Silk Mark Certified">
            <span className="material-symbols-outlined text-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>verified</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center h-full py-4 text-center md:text-left">
            <h2 className="font-headline-xl text-headline-xl text-primary mb-[16px]">Order Placed Successfully</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-[24px] max-w-md">
              We have received your order securely. Our master artisans are now preparing your handwoven selections for dispatch. You will receive an email shortly with tracking details.
            </p>
            <div className="mt-auto">
              <div className="flex justify-between items-center border-t border-outline-variant pt-[16px] mb-2">
                <span className="font-label-caps text-label-caps text-outline">Status</span>
                <span className="font-body-lg text-body-lg text-on-surface font-semibold text-primary">Awaiting Dispatch</span>
              </div>
              {state?.shippingPaid !== undefined && state?.codAmount !== undefined && (
                <div className="border-t border-outline-variant pt-[16px] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps text-outline">Speed Post Shipping Paid</span>
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">₹{state.shippingPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps text-outline">Remaining COD Amount</span>
                    <span className="font-body-lg text-body-lg text-primary font-semibold">₹{state.codAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-gutter justify-center w-full max-w-md">
        {/* Secondary Button */}
        <Link to="/collections" className="flex-1 py-[16px] px-[24px] border border-secondary-container bg-transparent text-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-variant transition-colors duration-300 text-center cursor-pointer">
          Continue Shopping
        </Link>
        {/* Primary Button */}
        <Link to="/dashboard" className="flex-1 py-[16px] px-[24px] bg-primary-container text-secondary-container font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-2 cursor-pointer">
          View Orders
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>inventory_2</span>
        </Link>
      </div>
    </main>
  );
};

export default OrderConfirmation;
