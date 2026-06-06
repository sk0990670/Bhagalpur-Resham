import AdminSidebar from '../../../shared/components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';


const AdminAnalyticsReports = () => {
    return (

        <div className="min-h-screen bg-[#FFF9EC] w-full flex font-body-md text-[#5A403C]">
            <AdminSidebar />
            <main className="ml-64 flex-1 flex flex-col h-screen">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 bg-[#FFF9EC]">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <AdminHeader />


{/*  Header & Filters  */}
<header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-outline-variant pb-6">
<div>
<h2 className="font-headline-xl text-headline-xl text-primary mb-2">Analytics &amp; Insights</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">Monitor the pulse of your artisanal heritage.</p>
</div>
<div className="flex flex-wrap items-center gap-4">
<div className="flex border border-outline-variant rounded-DEFAULT overflow-hidden bg-surface-container-lowest">
<button className="px-4 py-2 font-label-caps text-label-caps text-primary bg-surface-container-high border-r border-outline-variant hover:bg-surface-variant transition-colors">Daily</button>
<button className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant border-r border-outline-variant hover:bg-surface-variant transition-colors">Weekly</button>
<button className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant border-r border-outline-variant hover:bg-surface-variant transition-colors">Monthly</button>
<button className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-variant transition-colors">Yearly</button>
</div>
<div className="relative">
<input className="bg-surface-container-lowest border border-outline-variant px-4 py-2 pr-10 font-label-caps text-label-caps text-on-surface focus:outline-none focus:border-primary focus:border-b-2 rounded-DEFAULT w-40" placeholder="Custom Date" type="text"/>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">calendar_today</span>
</div>
</div>
</header>
{/*  Metric Cards Grid  */}
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/*  Card 1  */}
<div className="chart-border p-6 shadow-sm shadow-primary/5 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant">Revenue</span>
<span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
</div>
<div className="font-story-serif text-[32px] text-primary mb-2">₹12,45,000</div>
<div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-emerald-600">trending_up</span>
<span className="text-emerald-600 font-medium">+12%</span> vs last month
                </div>
</div>
{/*  Card 2  */}
<div className="chart-border p-6 shadow-sm shadow-primary/5 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant">Orders</span>
<span className="material-symbols-outlined text-secondary">shopping_cart_checkout</span>
</div>
<div className="font-story-serif text-[32px] text-primary mb-2">154</div>
<div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-emerald-600">trending_up</span>
<span className="text-emerald-600 font-medium">+8%</span> vs last month
                </div>
</div>
{/*  Card 3  */}
<div className="chart-border p-6 shadow-sm shadow-primary/5 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant">Conversion Rate</span>
<span className="material-symbols-outlined text-secondary">monitoring</span>
</div>
<div className="font-story-serif text-[32px] text-primary mb-2">3.2%</div>
<div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-emerald-600">trending_up</span>
<span className="text-emerald-600 font-medium">+0.5%</span> vs last month
                </div>
</div>
{/*  Card 4  */}
<div className="chart-border p-6 shadow-sm shadow-primary/5 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-on-surface-variant">Active Customers</span>
<span className="material-symbols-outlined text-secondary">groups</span>
</div>
<div className="font-story-serif text-[32px] text-primary mb-2">1,240</div>
<div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-emerald-600">trending_up</span>
<span className="text-emerald-600 font-medium">+15%</span> vs last month
                </div>
</div>
</section>
{/*  Main Chart Area  */}
<section className="chart-border p-8 shadow-sm shadow-primary/5 min-h-[400px] flex flex-col">
<div className="flex justify-between items-center mb-8">
<h3 className="font-story-serif text-story-serif text-primary">Revenue Trends</h3>
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_horiz</button>
</div>
{/*  Mock Line Chart area  */}
<div className="flex-1 flex items-end gap-2 relative mt-4">
{/*  Y-axis mock  */}
<div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-label-caps text-outline-variant pr-4 border-r border-outline-variant/30">
<span className="">15L</span><span className="">10L</span><span className="">5L</span><span className="">0</span>
</div>
{/*  X-axis lines mock  */}
<div className="absolute left-8 right-0 top-0 border-t border-outline-variant/20 w-full"></div>
<div className="absolute left-8 right-0 top-1/3 border-t border-outline-variant/20 w-full"></div>
<div className="absolute left-8 right-0 top-2/3 border-t border-outline-variant/20 w-full"></div>
<div className="absolute left-8 right-0 bottom-0 border-t border-outline-variant/40 w-full"></div>
{/*  Mock Area Path  */}
<div className="absolute left-8 right-0 bottom-0 top-0 z-10 overflow-hidden pointer-events-none">
<svg className="w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
<path className="text-primary-container" d="M0,100 L0,70 Q20,80 40,50 T80,30 L100,20 L100,100 Z" fill="currentColor"></path>
</svg>
<svg className="w-full h-full absolute top-0 left-0" preserveAspectRatio="none" viewBox="0 0 100 100">
<path className="text-primary" d="M0,70 Q20,80 40,50 T80,30 L100,20" fill="none" stroke="currentColor" stroke-width="0.5"></path>
</svg>
</div>
{/*  Data Points (Mock)  */}
<div className="absolute w-full h-full left-8 z-20 flex justify-between items-end pb-[1px] px-2">
<div className="w-2 h-2 rounded-full bg-secondary border border-surface-container-low mb-[28%] relative group cursor-pointer">
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-dim px-2 py-1 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity">₹4.2L</div>
</div>
<div className="w-2 h-2 rounded-full bg-secondary border border-surface-container-low mb-[35%] relative group cursor-pointer"></div>
<div className="w-2 h-2 rounded-full bg-secondary border border-surface-container-low mb-[50%] relative group cursor-pointer"></div>
<div className="w-2 h-2 rounded-full bg-secondary border border-surface-container-low mb-[45%] relative group cursor-pointer"></div>
<div className="w-2 h-2 rounded-full bg-secondary border border-surface-container-low mb-[70%] relative group cursor-pointer"></div>
<div className="w-2 h-2 rounded-full bg-secondary border border-surface-container-low mb-[80%] relative group cursor-pointer"></div>
</div>
{/*  X-axis labels  */}
<div className="absolute -bottom-8 left-8 right-0 flex justify-between text-[10px] font-label-caps text-outline-variant px-2">
<span className="">Jan</span><span className="">Feb</span><span className="">Mar</span><span className="">Apr</span><span className="">May</span><span className="">Jun</span>
</div>
</div>
</section>
{/*  Secondary Charts  */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
{/*  Bar Chart  */}
<div className="chart-border p-6 shadow-sm shadow-primary/5 min-h-[300px] flex flex-col">
<div className="flex justify-between items-center mb-6">
<h3 className="font-story-serif text-story-serif text-primary">Order Volume</h3>
<span className="font-label-caps text-label-caps text-on-surface-variant">Weekly</span>
</div>
<div className="flex-1 flex items-end justify-around gap-2 pt-8 pb-4 relative">
<div className="absolute left-0 right-0 bottom-4 border-t border-outline-variant/40"></div>
<div className="w-8 bg-surface-variant hover:bg-primary/80 transition-colors h-[40%] rounded-t-sm relative group cursor-pointer z-10">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 font-label-caps">42</span>
</div>
<div className="w-8 bg-surface-variant hover:bg-primary/80 transition-colors h-[60%] rounded-t-sm relative group cursor-pointer z-10">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 font-label-caps">68</span>
</div>
<div className="w-8 bg-primary h-[85%] rounded-t-sm shadow-[0_0_10px_rgba(139,0,0,0.3)] relative group cursor-pointer z-10">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 font-label-caps">95</span>
</div>
<div className="w-8 bg-surface-variant hover:bg-primary/80 transition-colors h-[50%] rounded-t-sm relative group cursor-pointer z-10">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 font-label-caps">54</span>
</div>
<div className="w-8 bg-surface-variant hover:bg-primary/80 transition-colors h-[75%] rounded-t-sm relative group cursor-pointer z-10">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 font-label-caps">82</span>
</div>
</div>
<div className="flex justify-around text-[10px] font-label-caps text-outline-variant px-2">
<span className="">W1</span><span className="">W2</span><span className="">W3</span><span className="">W4</span><span className="">W5</span>
</div>
</div>
{/*  Donut Chart  */}
<div className="chart-border p-6 shadow-sm shadow-primary/5 min-h-[300px] flex flex-col">
<div className="flex justify-between items-center mb-6">
<h3 className="font-story-serif text-story-serif text-primary">Category Performance</h3>
</div>
<div className="flex-1 flex items-center justify-center gap-8">
{/*  Mock Donut  */}
<div className="relative w-40 h-40 rounded-full border-[16px] border-surface-variant flex items-center justify-center">
{/*  Simulated segments via absolute borders (very hacky CSS only approach, normally SVG)  */}
<div className="absolute inset-[-16px] rounded-full border-[16px] border-primary" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 50%)', transform: 'rotate(45deg)' }}></div>
<div className="absolute inset-[-16px] rounded-full border-[16px] border-secondary" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)', transform: 'rotate(45deg)' }}></div>
<div className="text-center z-10 bg-surface-container-low rounded-full w-24 h-24 flex flex-col items-center justify-center">
<span className="font-headline-md text-[20px] text-primary">100%</span>
<span className="text-[10px] font-label-caps text-on-surface-variant">Volume</span>
</div>
</div>
{/*  Legend  */}
<div className="flex flex-col gap-4 font-body-md text-body-md">
<div className="flex items-center gap-2">
<div className="w-3 h-3 bg-primary rounded-full"></div>
<span className="text-on-surface-variant">Tussar Silk (45%)</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 bg-secondary rounded-full"></div>
<span className="text-on-surface-variant">Bhagalpuri (30%)</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 bg-surface-variant border border-outline rounded-full"></div>
<span className="text-on-surface-variant">Madhubani (25%)</span>
</div>
</div>
</div>
</div>
</section>
{/*  Table Section  */}
<section className="chart-border p-6 shadow-sm shadow-primary/5 overflow-hidden">
<div className="flex justify-between items-center mb-6">
<h3 className="font-story-serif text-story-serif text-primary">Top Selling Masterpieces</h3>
<button className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors flex items-center gap-1">
                    View Full Catalog <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant/40">
<th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">Product Name</th>
<th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant">Category</th>
<th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">Units Sold</th>
<th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant text-right">Revenue</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface">
<tr className="border-b border-outline-variant/20 hover:bg-surface-variant/30 transition-colors">
<td className="py-4 px-4 flex items-center gap-4">
<div className="w-10 h-10 bg-surface-dim rounded-sm border border-outline-variant/50 flex-shrink-0"></div>
<span className="font-medium text-primary">Crimson Tussar Zari Border</span>
</td>
<td className="py-4 px-4 text-on-surface-variant">Tussar Silk</td>
<td className="py-4 px-4 text-right">42</td>
<td className="py-4 px-4 text-right font-medium">₹3,57,000</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-variant/30 transition-colors">
<td className="py-4 px-4 flex items-center gap-4">
<div className="w-10 h-10 bg-surface-dim rounded-sm border border-outline-variant/50 flex-shrink-0"></div>
<span className="font-medium text-primary">Ivory Madhubani Hand-painted</span>
</td>
<td className="py-4 px-4 text-on-surface-variant">Madhubani</td>
<td className="py-4 px-4 text-right">28</td>
<td className="py-4 px-4 text-right font-medium">₹4,20,000</td>
</tr>
<tr className="hover:bg-surface-variant/30 transition-colors">
<td className="py-4 px-4 flex items-center gap-4">
<div className="w-10 h-10 bg-surface-dim rounded-sm border border-outline-variant/50 flex-shrink-0"></div>
<span className="font-medium text-primary">Golden Yellow Bhagalpuri Stole</span>
</td>
<td className="py-4 px-4 text-on-surface-variant">Bhagalpuri</td>
<td className="py-4 px-4 text-right">85</td>
<td className="py-4 px-4 text-right font-medium">₹1,27,500</td>
</tr>
</tbody>
</table>
</div>
</section>

                </div>
            </div>
        </main>
    </div>
    );
};

export default AdminAnalyticsReports;
