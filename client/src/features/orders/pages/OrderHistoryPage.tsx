import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../shared/services/api';
import CustomerSidebar from '../../../shared/components/CustomerSidebar';

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId: string, invoiceName: string) => {
    try {
      setDownloadingId(orderId);
      const res = await api.get(`/invoices/${orderId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${invoiceName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error('Download failed', err);
      const errorMessage = err.response?.data?.message || 'Invoice not available for this older order. Please create a new order.';
      alert(`Download failed: ${errorMessage}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'shipped': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-secondary-container/30 text-on-secondary-container border-secondary-container';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return 'schedule';
      case 'confirmed': return 'thumb_up';
      case 'processing': return 'autorenew';
      case 'shipped': return 'local_shipping';
      case 'delivered': return 'check_circle';
      case 'cancelled': return 'cancel';
      default: return 'sync';
    }
  };

  return (
    <div className="flex flex-1 w-full mx-auto relative bg-surface">
      <CustomerSidebar />

      {/* Canvas Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto py-8 px-margin-mobile md:px-margin-desktop min-h-[calc(100vh-88px)]">
        <div className="mb-12 text-center md:text-left relative">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Order History</h1>
          <div className="w-32 h-6 mx-auto md:mx-0 opacity-60" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 Q 25 20, 50 10 T 100 10\' fill=\'none\' stroke=\'%238e706b\' stroke-width=\'1\' stroke-dasharray=\'4,4\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat-x', backgroundPosition: 'center' }}></div>
          
          <div className="mt-6 p-4 bg-surface-container-low border border-outline-variant/50 rounded-md text-sm text-on-surface-variant flex flex-col md:flex-row gap-4 items-start md:items-center">
             <span className="material-symbols-outlined text-secondary">info</span>
             <div>
                <p><strong>Cancellations:</strong> Orders cannot be cancelled once shipped. To request cancellation please email <a href={`mailto:${import.meta.env.VITE_CANCELLATION_EMAIL}`} className="text-primary hover:underline">{import.meta.env.VITE_CANCELLATION_EMAIL}</a> with your Order ID.</p>
                <p className="mt-1"><strong>Returns:</strong> Returns must be requested via email within 7 days. Customer bears return shipping cost.</p>
             </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">inventory_2</span>
            <h2 className="font-headline-sm text-primary mb-2">No orders yet</h2>
            <p className="text-on-surface-variant mb-6">You haven't acquired any heritage pieces yet.</p>
            <Link to="/collections" className="px-6 py-3 bg-primary text-on-primary font-label-caps uppercase hover:bg-primary-container transition-colors">Start Exploring</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-surface-container-lowest ambient-shadow rounded-lg p-1 relative overflow-hidden border border-outline-variant/30">
                <div className="border border-secondary-container/50 p-6 rounded relative h-full flex flex-col md:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="w-full md:w-32 h-40 bg-surface-variant flex-shrink-0 relative overflow-hidden rounded flex items-center justify-center">
                    {order.items[0]?.image ? (
                      <img alt={order.items[0].name} className="w-full h-full object-cover" src={order.items[0].image} />
                    ) : (
                      <span className="material-symbols-outlined opacity-50">image</span>
                    )}
                  </div>
                  
                  {/* Order Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-4">
                      <div>
                        <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">Order {order.orderId}</h3>
                        <p className="font-body-md text-body-md text-on-surface">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full border flex items-center ${getStatusColor(order.status)}`}>
                        <span className="material-symbols-outlined mr-2 text-[16px]">{getStatusIcon(order.status)}</span>
                        <span className="font-label-caps text-[10px] uppercase">{order.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-story-serif text-[18px] text-primary mb-1">
                        {order.items[0]?.name}
                        {order.items.length > 1 && ` and ${order.items.length - 1} more item(s)`}
                      </h4>
                      <p className="font-body-md text-[14px] text-on-surface-variant mb-2">Qty: {order.items.reduce((acc: number, i: any) => acc + i.qty, 0)}</p>
                      
                      {/* Reward Points Status */}
                      {order.status === 'delivered' && (
                        <div className="flex flex-col gap-1 mt-2">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-variant border border-outline-variant/30 w-fit">
                            <span className="material-symbols-outlined text-[14px] text-secondary">stars</span>
                            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-wider">
                              Reward Status: {order.rewardCredited ? <span className="text-primary font-bold">POINTS CREDITED</span> : <span className="text-secondary">PENDING RETURN WINDOW</span>}
                            </span>
                          </div>
                          
                          {order.rewardCredited ? (
                            <div className="text-[11px] text-on-surface-variant flex gap-3 ml-1 mt-0.5">
                              <span>Points Earned: <span className="font-bold text-primary">{order.rewardPointsEarned}</span></span>
                              <span>•</span>
                              <span>Credited Date: {new Date(order.rewardCreditedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-on-surface-variant ml-1 mt-0.5">
                              Days Remaining: <span className="font-bold">{order.deliveredAt ? Math.max(0, 7 - Math.floor((Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24))) : 7}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between mt-auto pt-4 border-t border-outline-variant/30 gap-4">
                      <p className="font-story-serif text-story-serif text-on-surface font-semibold">Total: ₹{order.pricing?.total.toLocaleString()}</p>
                      <div className="flex space-x-4 w-full md:w-auto">
                        {(order.status === 'pending_verification' && order.paymentInfo?.status === 'pending') ? (
                          <Link 
                            to={`/checkout?retryOrderId=${order._id}`} 
                            className="flex-1 md:flex-none flex items-center justify-center px-6 py-2 bg-amber-600 text-white font-label-caps text-label-caps hover:bg-amber-700 transition-colors cursor-pointer text-center whitespace-nowrap shadow-sm"
                          >
                            <span className="material-symbols-outlined mr-2 text-[18px]">payment</span>
                            Continue Payment
                          </Link>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleDownloadInvoice(order._id, order.orderId)}
                              disabled={downloadingId === order._id || !order.invoicePdfUrl}
                              className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-outline text-primary font-label-caps text-label-caps hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined mr-2 text-[18px]">
                                {downloadingId === order._id ? 'sync' : 'download'}
                              </span>
                              Invoice
                            </button>
                            <Link 
                              to={`/track-order/${order._id}`} 
                              className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-primary text-primary font-label-caps text-label-caps hover:bg-primary/5 transition-colors cursor-pointer text-center whitespace-nowrap"
                            >
                              <span className="material-symbols-outlined mr-2 text-[18px]">local_shipping</span>
                              Track Order
                            </Link>
                            <Link to={`/order-confirmation`} state={{ orderId: order._id }} className="flex-1 md:flex-none px-6 py-2 bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary-container transition-colors cursor-pointer text-center whitespace-nowrap flex items-center justify-center">
                              View Details
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
