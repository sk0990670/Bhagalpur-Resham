import { useEffect, useState } from 'react';
import AdminSidebar from '../../../shared/components/AdminSidebar';
import api from '../../../shared/services/api';
import OrderDrawer from '../components/OrderDrawer';

const AdminOrdersManagement = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (searchQuery) params.append('search', searchQuery);
            
            const res = await api.get(`/orders?${params.toString()}`);
            setOrders(res.data.data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            fetchOrders();
        }
    };

    const handleRowClick = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsDrawerOpen(true);
    };

    const handleDownloadInvoice = async (orderId: string, invoiceName: string) => {
        try {
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
            const errorMessage = err.response?.data?.message || 'Invoice not available for this older order.';
            alert(`Download failed: ${errorMessage}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
          case 'pending_verification': return 'bg-amber-50 text-amber-700 border-amber-200';
          case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
          case 'in_production': return 'bg-purple-50 text-purple-700 border-purple-200';
          case 'ready_for_shipping': return 'bg-teal-50 text-teal-700 border-teal-200';
          case 'shipped': return 'bg-orange-50 text-orange-700 border-orange-200';
          case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
          case 'payment_failed': 
          case 'cancelled': return 'bg-error-container text-on-error-container border-outline-variant';
          default: return 'bg-surface-variant text-on-surface-variant border-outline-variant';
        }
    };

    return (
        <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen w-full overflow-hidden flex bg-pattern-madhubani">
            <AdminSidebar />
            <main className="ml-64 flex-1 flex flex-col h-full overflow-hidden">
                {/* TopAppBar */}
                <header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30 px-margin-desktop py-4 flex justify-between items-center">
                    <div className="flex-1 max-w-md relative group">
                        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                        <input 
                            className="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 pl-10 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors outline-none" 
                            placeholder="Press Enter to search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            type="text"
                        />
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-gutter lg:p-margin-desktop bg-surface-container-lowest">
                    <div className="max-w-container-max mx-auto space-y-section-gap pb-section-gap">
                        
                        <div className="mb-12">
                            <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Order Management</h2>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">Oversee the journey of every handcrafted masterpiece.</p>
                        </div>

                        {/* Filters & Actions */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 p-6 bg-surface-container-low rounded-xl border border-outline-variant">
                            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto ml-auto">
                                <div className="relative">
                                    <select 
                                        className="appearance-none bg-surface border border-outline-variant pl-4 pr-10 py-3 rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending_verification">Pending Verification</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="in_production">In Production</option>
                                        <option value="ready_for_shipping">Ready for Shipping</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="payment_failed">Payment Failed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="motif-border rounded-xl relative">
                            {isUpdating && (
                                <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            <div className="motif-border-inner rounded-lg overflow-x-auto shadow-sm">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead>
                                        <tr className="border-b border-outline-variant bg-surface-container-low">
                                            <th className="p-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Order ID</th>
                                            <th className="p-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Customer</th>
                                            <th className="p-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Date</th>
                                            <th className="p-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Amount</th>
                                            <th className="p-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Status</th>
                                            <th className="p-6 font-label-caps text-label-caps text-on-surface-variant font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-body-md text-on-surface divide-y divide-outline-variant">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-on-surface-variant">Loading orders...</td>
                                            </tr>
                                        ) : orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-on-surface-variant">No orders found.</td>
                                            </tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-surface-container-lowest transition-colors group cursor-pointer">
                                                    <td className="p-6 font-semibold text-primary">{order.orderId}</td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <p className="font-medium text-on-surface">{order.user?.name || order.shippingAddress?.name}</p>
                                                                <p className="text-sm text-on-surface-variant">{order.user?.email || 'Guest'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-6">
                                                        <div className="font-medium text-on-surface">₹{order.pricing?.total.toLocaleString()}</div>
                                                        <div className="text-xs text-on-surface-variant mt-1">
                                                            {order.paymentInfo?.method.toUpperCase()}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                            {order.status.replace(/_/g, ' ').toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleRowClick(order._id); }}
                                                                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Manage Order"
                                                            >
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </button>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDownloadInvoice(order._id, order.orderId);
                                                                }}
                                                                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Generate Invoice"
                                                            >
                                                                <span className="material-symbols-outlined">receipt_long</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            
            <OrderDrawer 
                orderId={selectedOrderId} 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                onOrderUpdated={fetchOrders} 
            />
        </div>
    );
};

export default AdminOrdersManagement;
