import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../authSlice';
import api from '../../../shared/services/api';
import CustomerSidebar from '../../../shared/components/CustomerSidebar';
import ProfileEditDrawer from '../components/ProfileEditDrawer';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, ordersRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/orders/my-orders')
      ]);

      if (profileRes.data?.success) {
        setProfile(profileRes.data.data);
      }
      if (ordersRes.data?.success) {
        const fetchedOrders = ordersRes.data.data;
        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex flex-1 w-full mx-auto relative bg-surface">
        <CustomerSidebar />
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-88px)]">
          <p className="font-label-caps text-on-surface-variant animate-pulse">Loading Dashboard...</p>
        </main>
      </div>
    );
  }

  const defaultAddress = profile.addresses?.find((a: any) => a.isDefault) || profile.addresses?.[0] || null;
  const joinDate = profile.createdAt ? new Date(profile.createdAt).getFullYear() : new Date().getFullYear();
  
  const safeOrders = Array.isArray(orders) ? orders : [];
  const totalSpend = safeOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
  const points = Math.floor(totalSpend * 0.05); // Dummy 5% points logic
  
  const activeOrders = safeOrders.filter(o => !['delivered', 'cancelled', 'returned'].includes(o.status));
  const recentOrders = safeOrders.slice(0, 2);

  return (
    <div className="flex flex-1 w-full mx-auto relative bg-surface">
      <CustomerSidebar />
      <main className="flex-1 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-88px)] w-full max-w-container-max mx-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Welcome & Summary Section */}
          <section className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Namaste, {profile.name || 'Patron'}</h1>
              <p className="font-story-serif text-story-serif text-on-surface-variant italic mb-6">Heritage Member since {joinDate}</p>
              
              <div className="bg-surface-container-low p-8 madhubani-border ambient-shadow">
                <h3 className="font-label-caps text-label-caps text-outline mb-4 border-b border-outline-variant/50 pb-2">Account Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Email</p>
                    <p className="font-body-md text-on-surface">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-body-md text-on-surface">{profile.phone || 'Not Provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[12px] text-on-surface-variant uppercase tracking-wider mb-1">Default Address</p>
                    {defaultAddress ? (
                      <p className="font-body-md text-on-surface">
                        {defaultAddress.addressLine1} {defaultAddress.addressLine2}<br/>
                        {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}
                      </p>
                    ) : (
                      <p className="font-body-md text-on-surface-variant italic">No address added yet.</p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <button onClick={() => setIsEditDrawerOpen(true)} className="px-6 py-2 bg-transparent border border-secondary-fixed-dim text-primary-container font-label-caps text-label-caps hover:bg-surface-variant transition-colors cursor-pointer">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
            
            {/* Loyalty Points Card */}
            <div className="w-full md:w-80 bg-primary-container text-on-primary p-8 text-center ambient-shadow relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffe088 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-secondary-fixed-dim rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <h3 className="font-headline-md text-[24px] text-secondary-container mb-1">Gold Tier</h3>
                <p className="font-body-md text-[14px] text-primary-fixed mb-6">Resham Points Balance</p>
                <p className="font-headline-xl text-[40px] font-bold text-on-primary mb-2">{points.toLocaleString()}</p>
                <button className="mt-4 px-6 py-2 bg-transparent border border-secondary-fixed-dim text-secondary-container font-label-caps text-label-caps hover:bg-primary transition-colors w-full cursor-pointer">
                  Redeem Points
                </button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 py-8 opacity-50">
            <div className="h-[1px] bg-outline w-24"></div>
            <span className="material-symbols-outlined text-outline">spa</span>
            <div className="h-[1px] bg-outline w-24"></div>
          </div>

          {/* Recent Orders Section */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline-md text-headline-md text-primary">Recent Acquisitions</h2>
              <Link to="/order-history" className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {safeOrders.length === 0 ? (
              <div className="bg-surface-container-low p-12 text-center madhubani-border ambient-shadow">
                <span className="material-symbols-outlined text-6xl text-outline mb-4">shopping_bag</span>
                <h3 className="font-headline-sm text-2xl text-on-surface font-bold mb-2">You have not acquired any heritage pieces yet.</h3>
                <p className="font-body-md text-on-surface-variant mb-6">Explore our curated collections of authentic Bhagalpur silks.</p>
                <Link to="/collections" className="inline-block px-8 py-3 bg-primary text-on-primary font-label-caps hover:bg-primary/90 transition-colors">
                  Explore Collections
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentOrders.map((order: any) => (
                  <div key={order._id || order.orderId} className="bg-surface-container-low p-6 madhubani-border ambient-shadow flex gap-6">
                    <div className="w-24 h-32 bg-surface-variant flex-shrink-0 relative">
                      {order.items?.[0]?.image ? (
                        <img 
                          alt="Product" 
                          className="w-full h-full object-cover" 
                          src={order.items[0].image}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
                          <span className="material-symbols-outlined text-on-surface-variant">image</span>
                        </div>
                      )}
                      <div className="absolute top-1 right-1 bg-surface/80 rounded-full p-0.5">
                        <span className="material-symbols-outlined text-[12px] text-secondary-container">verified</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <p className="text-[10px] font-label-caps text-outline mb-1">Order #{order.orderId}</p>
                        <h4 className="font-headline-md text-[18px] text-on-surface mb-2 leading-tight">
                          {order.items?.[0]?.name || 'Heritage Saree'}
                        </h4>
                        <p className="font-body-md text-[14px] text-on-surface-variant">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 font-label-caps text-[10px] ${
                          order.status === 'delivered' ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-surface-variant text-primary'
                        }`}>
                          <span className="material-symbols-outlined text-[12px]">
                            {order.status === 'delivered' ? 'check_circle' : 'local_shipping'}
                          </span> 
                          {(order.status || 'pending').toUpperCase()}
                        </span>
                        
                        {order.status !== 'delivered' && (
                          <Link to={`/track-order/${order.orderId}`} className="text-xs font-bold text-secondary hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                            Track <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <ProfileEditDrawer 
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onUpdate={fetchDashboardData}
        profile={profile}
      />
    </div>
  );
};

export default CustomerDashboard;
