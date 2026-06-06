import React, { useState, useEffect } from 'react';
import api from '../../../shared/services/api';

interface OrderDrawerProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: () => void;
}

const OrderDrawer: React.FC<OrderDrawerProps> = ({ orderId, isOpen, onClose, onOrderUpdated }) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [shippingData, setShippingData] = useState({ courierName: '', trackingNumber: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedArtisanId, setSelectedArtisanId] = useState('');

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
      fetchArtisans();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      console.error('Failed to fetch order details', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtisans = async () => {
    try {
      const res = await api.get('/artisans');
      if (res.data?.success) {
        setArtisans(res.data.data.artisans || []);
      }
    } catch (err) {
      console.error('Failed to fetch artisans', err);
    }
  };

  const handleVerifyPayment = async (action: 'approve' | 'reject') => {
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order._id}/verify-payment`, { action });
      await fetchOrderDetails();
      onOrderUpdated();
    } catch (err) {
      console.error('Payment verification failed', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignArtisan = async () => {
    if (!selectedArtisanId) return;
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order._id}/assign-artisan`, { artisanId: selectedArtisanId });
      await fetchOrderDetails();
      onOrderUpdated();
      setSelectedArtisanId('');
    } catch (err) {
      console.error('Artisan assignment failed', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkReady = async () => {
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order._id}/ready-for-shipping`);
      await fetchOrderDetails();
      onOrderUpdated();
    } catch (err) {
      console.error('Mark ready failed', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShipOrder = async () => {
    if (!shippingData.courierName || !shippingData.trackingNumber) return alert('Please provide shipping details');
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order._id}/ship`, shippingData);
      await fetchOrderDetails();
      onOrderUpdated();
    } catch (err) {
      console.error('Shipping failed', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkDelivered = async () => {
    try {
      setIsUpdating(true);
      await api.patch(`/orders/${order._id}/deliver`);
      await fetchOrderDetails();
      onOrderUpdated();
    } catch (err) {
      console.error('Mark delivered failed', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-surface/50 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 w-full max-w-3xl bg-surface shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-outline-variant ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-center p-6 border-b border-outline-variant bg-surface-container-lowest">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">Order Management</h2>
            {order && <p className="font-body-md text-on-surface-variant">ID: {order.orderId}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface-container-lowest relative">
          {(loading || isUpdating) && (
            <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {order && (
            <>
              {/* STATUS BADGE */}
              <div className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-lg">
                <span className="font-label-caps text-secondary">CURRENT STATUS:</span>
                <span className="font-headline-sm text-primary uppercase">{order.status.replace('_', ' ')}</span>
              </div>

              {/* CUSTOMER INFO */}
              <section className="space-y-4">
                <h3 className="font-headline-sm text-secondary border-b border-outline-variant pb-2">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4 font-body-md">
                  <div>
                    <p className="text-on-surface-variant">Name</p>
                    <p className="text-on-surface">{order.shippingAddress?.name || order.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Contact</p>
                    <p className="text-on-surface">{order.shippingAddress?.phone} / {order.user?.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-on-surface-variant">Address</p>
                    <p className="text-on-surface">{order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                  </div>
                </div>
              </section>

              {/* PRODUCT DETAILS */}
              <section className="space-y-4">
                <h3 className="font-headline-sm text-secondary border-b border-outline-variant pb-2">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 border border-outline-variant rounded-lg bg-surface-container-lowest">
                      <img src={item.image} alt={item.name} className="w-24 h-36 object-cover rounded-md" />
                      <div className="flex-1 font-body-md py-2">
                        <h4 className="font-bold text-on-surface">{item.name}</h4>
                        <p className="text-on-surface-variant">SKU: {item.sku}</p>
                        <p className="text-on-surface-variant">Qty: {item.qty} | Price: ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 1. PAYMENT VERIFICATION */}
              {order.status === 'pending_verification' && (
                <section className="space-y-4 p-6 bg-surface-container-low border border-outline-variant rounded-xl">
                  <h3 className="font-headline-sm text-primary flex items-center gap-2"><span className="material-symbols-outlined">payments</span> Payment Verification</h3>
                  <div className="grid grid-cols-2 gap-4 font-body-md mb-6">
                    <div><p className="text-on-surface-variant">Method</p><p className="font-bold uppercase">{order.paymentInfo?.method}</p></div>
                    <div><p className="text-on-surface-variant">Amount</p><p className="font-bold text-green-700">₹{order.pricing?.total}</p></div>
                    {order.paymentInfo?.razorpayPaymentId && (
                      <div className="col-span-2"><p className="text-on-surface-variant">Transaction ID</p><p className="font-mono">{order.paymentInfo.razorpayPaymentId}</p></div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleVerifyPayment('approve')} className="flex-1 py-3 bg-primary text-on-primary rounded hover:bg-primary/90 font-label-caps cursor-pointer">APPROVE PAYMENT</button>
                    <button onClick={() => handleVerifyPayment('reject')} className="flex-1 py-3 border border-error text-error rounded hover:bg-error-container font-label-caps cursor-pointer">REJECT PAYMENT</button>
                  </div>
                </section>
              )}

              {/* 2. ARTISAN ASSIGNMENT */}
              {order.status === 'confirmed' && (
                <section className="space-y-4 p-6 bg-surface-container-low border border-outline-variant rounded-xl">
                  <h3 className="font-headline-sm text-primary flex items-center gap-2"><span className="material-symbols-outlined">person_add</span> Assign Artisan</h3>
                  <p className="font-body-md text-on-surface-variant mb-4">Select an artisan based on required skills and current workload.</p>
                  
                  <div className="relative">
                    <div className="flex items-center bg-surface border border-outline-variant rounded-lg p-2 focus-within:border-primary transition-colors cursor-text" onClick={() => setIsDropdownOpen(true)}>
                      <span className="material-symbols-outlined text-on-surface-variant ml-2 mr-2">search</span>
                      <input
                        type="text"
                        placeholder="Search & Select Artisan ▼"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full bg-transparent text-on-surface focus:outline-none p-2"
                      />
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-highest border border-outline-variant rounded-lg max-h-60 overflow-y-auto shadow-xl z-20">
                        {artisans
                          .filter(a => 
                            a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            a.specialization.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            a.location?.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map(artisan => (
                            <div 
                              key={artisan._id} 
                              onClick={() => {
                                setSelectedArtisanId(artisan._id);
                                setIsDropdownOpen(false);
                                setSearchQuery('');
                              }}
                              className={`p-4 cursor-pointer hover:bg-primary/10 border-b border-outline-variant/30 last:border-0 transition-colors ${selectedArtisanId === artisan._id ? 'bg-primary/20 border-l-4 border-l-primary' : ''}`}
                            >
                              <div className="flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-bold text-on-surface">{artisan.name}</p>
                                  <span className="text-xs font-bold text-secondary">{artisan.rating || artisan.qualityRating} ⭐</span>
                                </div>
                                <p className="text-xs text-secondary-fixed font-bold uppercase mb-1">{artisan.specialization.join(', ')}</p>
                                <div className="flex justify-between items-center text-xs text-on-surface-variant mt-2">
                                  <span>Workload: {artisan.activeOrders}/{artisan.maxCapacity}</span>
                                  <span>Exp: {artisan.experience} yrs</span>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  )}

                  {/* Selected Artisan Card */}
                  {selectedArtisanId && (() => {
                    const selected = artisans.find(a => a._id === selectedArtisanId);
                    if (!selected) return null;
                    const isAtCapacity = selected.activeOrders >= selected.dailyCapacity;
                    return (
                      <div className="mt-4 p-4 border border-primary/30 bg-primary/5 rounded-xl">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-full bg-surface-container-high border-2 border-primary flex items-center justify-center font-bold text-primary text-xl shrink-0">
                            {selected.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-primary text-lg">{selected.name}</h4>
                              {isAtCapacity && (
                                <span className="px-2 py-1 bg-error text-white text-[10px] rounded uppercase font-bold tracking-wider">FULL CAPACITY</span>
                              )}
                            </div>
                            <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-2">{selected.specialization.join(' • ')}</p>
                            <div className="grid grid-cols-2 gap-y-2 text-xs text-on-surface">
                              <p><span className="text-on-surface-variant">Experience:</span> {selected.experienceYears} Years</p>
                              <p><span className="text-on-surface-variant">Workload:</span> <span className={isAtCapacity ? 'text-error font-bold' : ''}>{selected.activeOrders}/{selected.dailyCapacity} Active</span></p>
                              <p className="col-span-2"><span className="text-on-surface-variant">Total Earnings:</span> ₹{selected.earnings?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={handleAssignArtisan} 
                          disabled={isAtCapacity}
                          className={`w-full mt-6 py-3 rounded font-label-caps transition-colors shadow-md ${isAtCapacity ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-secondary text-on-secondary hover:bg-secondary/90 cursor-pointer'}`}
                        >
                          {isAtCapacity ? 'CANNOT ASSIGN (AT CAPACITY)' : 'ASSIGN ARTISAN'}
                        </button>
                      </div>
                    );
                  })()}
                </section>
              )}

              {/* 3. IN PRODUCTION */}
              {order.status === 'in_production' && (
                <section className="space-y-4 p-6 bg-surface-container-low border border-outline-variant rounded-xl text-center">
                  <h3 className="font-headline-sm text-primary flex items-center justify-center gap-2"><span className="material-symbols-outlined">precision_manufacturing</span> In Production</h3>
                  <p className="font-body-md text-on-surface-variant mb-4">Artisan is currently handcrafting this masterpiece.</p>
                  <button onClick={handleMarkReady} className="w-full py-3 bg-primary text-on-primary rounded hover:bg-primary/90 font-label-caps cursor-pointer">MARK READY FOR SHIPPING</button>
                </section>
              )}

              {/* 4. SHIPPING */}
              {order.status === 'ready_for_shipping' && (
                <section className="space-y-4 p-6 bg-surface-container-low border border-outline-variant rounded-xl">
                  <h3 className="font-headline-sm text-primary flex items-center gap-2"><span className="material-symbols-outlined">local_shipping</span> Ship Order</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block font-label-caps text-on-surface-variant mb-2">Courier Partner</label>
                      <input type="text" value={shippingData.courierName} onChange={e => setShippingData({...shippingData, courierName: e.target.value})} className="w-full bg-surface border border-outline-variant rounded p-3" placeholder="e.g. BlueDart" />
                    </div>
                    <div>
                      <label className="block font-label-caps text-on-surface-variant mb-2">Tracking Number</label>
                      <input type="text" value={shippingData.trackingNumber} onChange={e => setShippingData({...shippingData, trackingNumber: e.target.value})} className="w-full bg-surface border border-outline-variant rounded p-3" placeholder="e.g. BD123456789" />
                    </div>
                    <button onClick={handleShipOrder} className="w-full py-3 mt-2 bg-primary text-on-primary rounded hover:bg-primary/90 font-label-caps cursor-pointer">DISPATCH ORDER</button>
                  </div>
                </section>
              )}

              {/* 5. DELIVERED */}
              {order.status === 'shipped' && (
                <section className="space-y-4 p-6 bg-surface-container-low border border-outline-variant rounded-xl text-center">
                  <h3 className="font-headline-sm text-primary flex items-center justify-center gap-2"><span className="material-symbols-outlined">redeem</span> Mark Delivered</h3>
                  <p className="font-body-md text-on-surface-variant mb-4">Confirm that the customer has received their order.</p>
                  <button onClick={handleMarkDelivered} className="w-full py-3 bg-green-700 text-white rounded hover:bg-green-800 font-label-caps cursor-pointer">MARK AS DELIVERED</button>
                </section>
              )}
              
              {/* AUDIT LOG */}
              <section className="space-y-4 pt-6">
                <h3 className="font-headline-sm text-secondary border-b border-outline-variant pb-2">Audit Log</h3>
                <div className="space-y-4">
                  {order.statusHistory?.map((log: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      {log.status === 'in_production' ? (
                        <div className="w-6 h-6 rounded-full bg-[#8B0000] text-white flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
                          <span className="font-bold text-[10px] leading-none tracking-tighter" style={{ fontFamily: 'sans-serif' }}>S</span>
                          <span className="material-symbols-outlined text-[10px] leading-none -ml-[1px] mt-[1px]">pool</span>
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                      )}
                      <div>
                        <p className="font-bold text-on-surface uppercase text-sm">
                          {log.status === 'in_production' ? 'WEAVING IN PROGRESS' : 
                           log.status === 'ready_for_shipping' ? 'QUALITY CHECK & CERTIFICATION' : 
                           log.status.replace(/_/g, ' ').toUpperCase()}
                        </p>
                        <p className="text-xs text-on-surface-variant">{new Date(log.timestamp).toLocaleString()}</p>
                        {log.note && <p className="text-sm text-on-surface mt-1 italic">{log.note}</p>}
                      </div>
                    </div>
                  )).reverse()}
                </div>
              </section>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDrawer;
