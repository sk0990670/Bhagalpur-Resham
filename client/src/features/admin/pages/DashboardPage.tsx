import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import AdminSidebar from '../../../shared/components/AdminSidebar';
import { Line } from 'react-chartjs-2';
import api from '../../../shared/services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#fff9ec',
            titleColor: '#1e1c12',
            bodyColor: '#8b0000',
            borderColor: '#e3beb8',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            titleFont: { family: 'Montserrat', size: 12 },
            bodyFont: { family: 'Montserrat', size: 14, weight: 'bold' as const }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(227, 190, 184, 0.3)' },
            border: { display: false },
            ticks: { color: '#5a403c', font: { family: 'Montserrat', size: 12 } }
        },
        x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#5a403c', font: { family: 'Montserrat', size: 12 } }
        }
    },
    interaction: {
        intersect: false,
        mode: 'index' as const,
    }
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
        pendingOrders: 0
    });
    const [salesData, setSalesData] = useState<any>(null);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, salesRes, productsRes, ordersRes] = await Promise.all([
                    api.get('/analytics/dashboard').catch(() => ({ data: { data: {} } })),
                    api.get('/analytics/sales').catch(() => ({ data: { data: [] } })),
                    api.get('/analytics/top-products').catch(() => ({ data: { data: [] } })),
                    api.get('/orders?limit=5').catch(() => ({ data: { data: [] } }))
                ]);

                setStats({
                    totalOrders: statsRes.data.data.totalOrders || 0,
                    totalRevenue: statsRes.data.data.totalRevenue || 0,
                    totalCustomers: statsRes.data.data.totalCustomers || 0,
                    totalProducts: statsRes.data.data.totalProducts || 0,
                    pendingOrders: statsRes.data.data.pendingOrders || 0
                });

                const sales = salesRes.data.data;
                if (sales && sales.length > 0) {
                    setSalesData({
                        labels: sales.map((s: any) => s._id),
                        datasets: [{
                            label: 'Revenue (₹)',
                            data: sales.map((s: any) => s.totalRevenue),
                            borderColor: '#8b0000',
                            backgroundColor: 'rgba(139, 0, 0, 0.1)',
                            borderWidth: 3,
                            pointBackgroundColor: '#fed65b',
                            pointBorderColor: '#8b0000',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.4
                        }]
                    });
                } else {
                    // Fallback empty chart data
                    setSalesData({ labels: [], datasets: [] });
                }

                setTopProducts(productsRes.data.data || []);
                setRecentOrders(ordersRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'delivered': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-sm"><span className="material-symbols-outlined text-[14px]">check_circle</span> Delivered</span>;
            case 'shipped': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container text-sm"><span className="material-symbols-outlined text-[14px]">local_shipping</span> Shipped</span>;
            case 'cancelled': return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-error-container text-on-error-container text-sm"><span className="material-symbols-outlined text-[14px]">cancel</span> Cancelled</span>;
            default: return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant text-sm"><span className="material-symbols-outlined text-[14px]">pending</span> {status.charAt(0).toUpperCase() + status.slice(1)}</span>;
        }
    };

    if (loading) {
        return (
            <div className="bg-surface min-h-screen w-full flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen w-full overflow-hidden flex bg-pattern-madhubani">
            <AdminSidebar />
            <main className="ml-64 flex-1 flex flex-col h-full overflow-hidden">
                <header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30 px-margin-desktop py-4 flex justify-between items-center">
                    <div className="flex-1 max-w-md relative group">
                        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                        <input className="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 pl-10 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors outline-none" placeholder="Search dashboard..." type="text"/>
                    </div>
                    <div className="flex items-center gap-6 text-on-surface-variant">
                        <button className="relative hover:text-primary transition-colors cursor-pointer active:scale-95">
                            <span className="material-symbols-outlined" >notifications</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
                        </button>
                        <div className="h-6 w-px bg-outline-variant/50"></div>
                        <button className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer active:scale-95">
                            <span className="material-symbols-outlined" >account_circle</span>
                            <div className="text-left hidden md:block">
                                <p className="font-label-caps text-[10px] tracking-wider uppercase text-primary font-bold">Admin</p>
                            </div>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-gutter lg:p-margin-desktop bg-surface-container-lowest">
                    <div className="max-w-container-max mx-auto space-y-section-gap pb-section-gap">
                        <section>
                            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-unit">
                                <div className="bg-surface p-6 rounded-lg tinted-shadow ornamental-border border border-outline-variant/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL ORDERS</p>
                                    <p className="font-headline-xl text-headline-xl text-primary-container">{stats.totalOrders}</p>
                                </div>
                                <div className="bg-surface p-6 rounded-lg tinted-shadow ornamental-border border border-outline-variant/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL REVENUE</p>
                                    <p className="font-headline-xl text-headline-xl text-primary-container">₹{stats.totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="bg-surface p-6 rounded-lg tinted-shadow ornamental-border border border-outline-variant/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL CUSTOMERS</p>
                                    <p className="font-headline-xl text-headline-xl text-primary-container">{stats.totalCustomers}</p>
                                </div>
                                <div className="bg-surface p-6 rounded-lg tinted-shadow ornamental-border border border-outline-variant/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL PRODUCTS</p>
                                    <p className="font-headline-xl text-headline-xl text-primary-container">{stats.totalProducts}</p>
                                </div>
                                <div className="bg-surface-container p-6 rounded-lg tinted-shadow ornamental-border border border-error/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <p className="font-label-caps text-label-caps text-error mb-2">PENDING ORDERS</p>
                                    <p className="font-headline-xl text-headline-xl text-error">{stats.pendingOrders}</p>
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                            <div className="lg:col-span-2 bg-surface p-8 rounded-xl tinted-shadow ornamental-border border border-outline-variant/20">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-headline-md text-headline-md text-on-surface">Sales Journey</h3>
                                </div>
                                <div className="w-full h-64 relative">
                                    {salesData && salesData.labels.length > 0 ? (
                                        <Line data={salesData} options={chartOptions} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-on-surface-variant">No sales data available</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-surface p-8 rounded-xl tinted-shadow ornamental-border border border-outline-variant/20 flex flex-col">
                                <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Masterpieces</h3>
                                <p className="font-label-caps text-label-caps text-on-surface-variant mb-4">TOP SELLING SAREES</p>
                                <div className="space-y-4 flex-grow">
                                    {topProducts.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 hover:bg-surface-container-lowest transition-colors rounded-lg border-b border-outline-variant/30 last:border-0">
                                            <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden relative">
                                                {item.image ? (
                                                    <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                                ) : (
                                                    <span className="material-symbols-outlined flex items-center justify-center w-full h-full opacity-50">image</span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-headline-sm text-on-surface font-semibold line-clamp-1">{item.name}</h4>
                                                <p className="font-body-sm text-on-surface-variant">{item.soldCount || 0} sold</p>
                                            </div>
                                        </div>
                                    ))}
                                    {topProducts.length === 0 && <p className="text-on-surface-variant text-sm">No sales yet.</p>}
                                </div>
                                <Link to="/admin/inventory" className="mt-4 font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors w-full text-center py-2 border border-primary/20 rounded block">VIEW INVENTORY</Link>
                            </div>
                        </section>

                        <section>
                            <div className="bg-surface p-8 rounded-xl tinted-shadow ornamental-border border border-outline-variant/20 overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-headline-md text-headline-md text-on-surface">Recent Commissions</h3>
                                    <Link to="/admin/orders" className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                                        VIEW ALL <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-outline-variant/50">
                                                <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">ORDER ID</th>
                                                <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">PATRON</th>
                                                <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">VALUE</th>
                                                <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant">STATUS</th>
                                                <th className="py-4 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">DATE</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-body-md text-body-md text-on-surface">
                                            {recentOrders.map((order) => (
                                                <tr key={order._id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
                                                    <td className="py-4 px-4 font-semibold text-primary">{order.orderId}</td>
                                                    <td className="py-4 px-4">{order.user?.name || order.shippingAddress?.fullName || 'Guest'}</td>
                                                    <td className="py-4 px-4">₹{order.pricing?.total?.toLocaleString() || 0}</td>
                                                    <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                                                    <td className="py-4 px-4 text-right text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                            {recentOrders.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">No orders found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
