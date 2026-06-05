import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../../shared/services/api';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { orderId?: string } | undefined;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/order-history');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${state.orderId}`);
        setOrder(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [state, navigate]);

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const res = await api.get(`/invoices/${order._id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error('Download failed', err);
      const errorMessage = err.response?.data?.message || 'Invoice not available for this older order. Please create a new order.';
      alert(`Download failed: ${errorMessage}`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 font-label-caps text-primary tracking-widest uppercase">Securing Your Masterpiece...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="font-headline-lg text-error mb-4">Could Not Load Order</h1>
        <p className="font-body-md text-on-surface-variant mb-8">{error}</p>
        <Link to="/order-history" className="px-6 py-3 bg-primary text-on-primary font-label-caps uppercase tracking-widest hover:bg-primary-container transition-colors">
          View Order History
        </Link>
      </main>
    );
  }

  const estimatedDeliveryDate = order.estimatedDelivery 
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
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
            <span className="font-headline-md text-headline-md text-primary">#{order.orderId}</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-outline-variant"></div>
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline mb-1">Estimated Delivery</span>
            <span className="font-body-lg text-body-lg text-on-surface-variant mt-1">{estimatedDeliveryDate}</span>
          </div>
        </div>
      </div>

      {/* Product Cards */}
      {order.items.map((item: any, index: number) => (
        <div key={index} className="w-full max-w-3xl bg-surface-container-lowest p-[16px] shadow-[0_10px_25px_-5px_rgba(128,0,32,0.04),0_8px_10px_-6px_rgba(128,0,32,0.04)] mb-[24px]">
          <div className="border border-secondary-container p-[24px] flex flex-col md:flex-row gap-[32px] items-center md:items-start relative">
            {/* Artisan Badge */}
            <div className="absolute top-[16px] left-[16px] z-10 bg-surface-container-lowest rounded-full p-2 border border-secondary-container shadow-[0_10px_25px_-5px_rgba(128,0,32,0.04),0_8px_10px_-6px_rgba(128,0,32,0.04)]" title="Silk Mark Certified">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">verified</span>
            </div>
            {/* Product Thumbnail */}
            <div className="w-full md:w-[240px] aspect-[3/4] bg-surface-variant overflow-hidden flex-shrink-0">
              {item.image ? (
                <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">image</span>
                </div>
              )}
            </div>
            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-center h-full py-4 text-center md:text-left w-full">
              <h2 className="font-headline-xl text-headline-xl text-primary mb-[16px]">{item.name}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-[24px] max-w-md">
                Handwoven over 14 days by master artisans. 100% pure authentic handloom silk. <br/>
                Quantity: {item.qty}
              </p>
              <div className="mt-auto">
                <div className="flex justify-between items-center border-t border-outline-variant pt-[16px]">
                  <span className="font-label-caps text-label-caps text-outline">Item Total</span>
                  <span className="font-body-lg text-body-lg text-on-surface font-semibold">₹ {item.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Order Total Summary */}
      <div className="w-full max-w-3xl bg-surface-container-lowest p-[16px] shadow-[0_10px_25px_-5px_rgba(128,0,32,0.04),0_8px_10px_-6px_rgba(128,0,32,0.04)] mb-[64px]">
        <div className="border border-secondary-container p-[24px] flex flex-col sm:flex-row justify-between items-center gap-4">
           <div>
             <h3 className="font-headline-md text-headline-md text-primary">Total Paid</h3>
             <p className="font-body-md text-on-surface-variant">Including taxes and shipping</p>
           </div>
           <div className="text-right">
             <span className="font-display-lg-mobile text-display-lg-mobile text-primary">₹ {order.pricing?.total.toLocaleString()}</span>
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-gutter justify-center w-full max-w-md mb-[64px]">
        <Link to="/" className="flex-1 py-[16px] px-[24px] border border-secondary-container bg-transparent text-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-variant transition-colors duration-300 text-center">
          Continue Shopping
        </Link>
        <button 
          onClick={handleDownloadInvoice}
          disabled={downloading}
          className="flex-1 py-[16px] px-[24px] bg-primary-container text-secondary-container font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {downloading ? 'Downloading...' : 'Download Invoice'}
          <span className="material-symbols-outlined text-[18px]">
            {downloading ? 'sync' : 'download'}
          </span>
        </button>
      </div>
    </main>
  );
};

export default OrderConfirmationPage;
