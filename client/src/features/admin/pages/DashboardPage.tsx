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
import crimsonTussarAsset from '../../../assets/crimson_tussar.png';
import midnightIndigoAsset from '../../../assets/midnight_indigo.png';
import ivoryZariAsset from '../../../assets/ivory_zari.png';


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

const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [{
        label: 'Revenue (₹ Lakhs)',
        data: [4.2, 5.1, 4.8, 6.2, 5.9, 7.5, 8.1, 9.4, 11.2, 14.5],
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
};

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

    return (
        <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen w-full overflow-hidden flex bg-pattern-madhubani">
            
{/*  SideNavBar  */}
<AdminSidebar />
{/*  Main Content  */}
<main className="ml-64 flex-1 flex flex-col h-full overflow-hidden">
{/*  TopAppBar (Minimal, Sticky)  */}
<header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30 px-margin-desktop py-4 flex justify-between items-center">
{/*  Search Bar (Left aligned)  */}
<div className="flex-1 max-w-md relative group">
<span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
<input className="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 pl-10 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors outline-none" placeholder="Search orders, artisans, or silk marks..." type="text"/>
</div>
{/*  Trailing Actions  */}
<div className="flex items-center gap-6 text-on-surface-variant">
<button className="relative hover:text-primary transition-colors cursor-pointer active:scale-95">
<span className="material-symbols-outlined" >notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
</button>
<div className="h-6 w-px bg-outline-variant/50"></div>
<button className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer active:scale-95">
<span className="material-symbols-outlined" >account_circle</span>
<div className="text-left hidden md:block">
<p className="font-label-caps text-[10px] tracking-wider uppercase text-primary font-bold">Aarav M.</p>
<p className="font-label-caps text-[9px] text-on-surface-variant">Master Weaver</p>
</div>
</button>
</div>
</header>
{/*  Scrollable Canvas  */}
<div className="flex-1 overflow-y-auto p-gutter lg:p-margin-desktop bg-surface-container-lowest">
<div className="max-w-container-max mx-auto space-y-section-gap pb-section-gap">
{/*  Metrics Grid  */}
<section>
<h2 className="font-headline-md text-headline-md text-on-surface mb-6">Overview</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-unit">
{/*  Card 1  */}
<div className="bg-surface p-6 rounded-lg tinted-shadow ornamental-border border border-outline-variant/20 relative overflow-hidden group">
<div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
<p className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL ORDERS</p>
<p className="font-headline-xl text-headline-xl text-primary-container">1,240</p>
</div>
{/*  Card 2  */}
<div className="bg-surface p-6 rounded-lg tinted-shadow ornamental-border border border-outline-variant/20 relative overflow-hidden group">
<div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
<p className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL REVENUE</p>
<p className="font-headline-xl text-headline-xl text-primary-container">₹18.5L</p>
</div>
{/*  Card 3  */}
<div className="bg-surface p-6 rounded-lg tinted-shadow ornamental-border border border-outline-variant/20 relative overflow-hidden group">
<div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
<p className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL CUSTOMERS</p>
<p className="font-headline-xl text-headline-xl text-primary-container">850</p>
</div>
{/*  Card 4  */}
<div className="bg-surface p-6 rounded-lg tinted-shadow ornamental-border border border-outline-variant/20 relative overflow-hidden group">
<div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
<p className="font-label-caps text-label-caps text-on-surface-variant mb-2">TOTAL PRODUCTS</p>
<p className="font-headline-xl text-headline-xl text-primary-container">124</p>
</div>
{/*  Card 5  */}
<div className="bg-surface-container p-6 rounded-lg tinted-shadow ornamental-border border border-error/20 relative overflow-hidden group">
<div className="absolute inset-0 madhubani-pattern opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
<p className="font-label-caps text-label-caps text-error mb-2">PENDING ORDERS</p>
<p className="font-headline-xl text-headline-xl text-error">42</p>
</div>
</div>
</section>
{/*  Chart & Top Products Layout  */}
<section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
{/*  Sales Chart  */}
<div className="lg:col-span-2 bg-surface p-8 rounded-xl tinted-shadow ornamental-border border border-outline-variant/20">
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline-md text-headline-md text-on-surface">Sales Journey</h3>
<button className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                                THIS YEAR <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
</div>
<div className="w-full h-64 relative">
<Line data={chartData} options={chartOptions} />
</div>
</div>
{/*  Top Selling  */}
<div className="bg-surface p-8 rounded-xl tinted-shadow ornamental-border border border-outline-variant/20 flex flex-col">
<h3 className="font-headline-md text-headline-md text-on-surface mb-6">Masterpieces</h3>
<p className="font-label-caps text-label-caps text-on-surface-variant mb-4">TOP SELLING SAREES</p>
<div className="space-y-4 flex-grow">
{/*  Item 1  */}
<div className="flex items-center gap-4 p-4 hover:bg-surface-container-lowest transition-colors rounded-lg border-b border-outline-variant/30 last:border-0">
<div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden relative">
<img alt="Crimson Tussar" className="w-full h-full object-cover" data-alt="Close up of luxurious deep crimson red Tussar silk fabric. Intricate golden zari work on the border. Warm, inviting lighting emphasizing the rich texture and traditional craftsmanship. High-end product photography." src={crimsonTussarAsset}/>
</div>
<div>
<h4 className="font-headline-sm text-on-surface font-semibold">Crimson Tussar</h4>
<p className="font-body-sm text-on-surface-variant">420 sold</p>
</div>
</div>
{/*  Item 2  */}
<div className="flex items-center gap-4 p-4 hover:bg-surface-container-lowest transition-colors rounded-lg border-b border-outline-variant/30 last:border-0">
<div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden relative">
<img alt="Midnight Indigo" className="w-full h-full object-cover" data-alt="Elegant dark indigo blue silk fabric draped beautifully. Subtle sheen catching the light. Minimalist setting, focus on the deep, rich color and smooth texture. Premium editorial style." src={midnightIndigoAsset}/>
</div>
<div>
<h4 className="font-headline-sm text-on-surface font-semibold">Midnight Indigo</h4>
<p className="font-body-sm text-on-surface-variant">385 sold</p>
</div>
</div>
{/*  Item 3  */}
<div className="flex items-center gap-4 p-4 hover:bg-surface-container-lowest transition-colors rounded-lg border-b border-outline-variant/30 last:border-0">
<div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden relative">
<img alt="Ivory Zari" className="w-full h-full object-cover" data-alt="Pristine ivory white raw silk fabric with delicate gold zari embroidery. Soft, diffused natural light creating a gentle and ethereal mood. Showcasing the fine details of the artisanal weaving." src={ivoryZariAsset}/>
</div>
<div>
<h4 className="font-headline-sm text-on-surface font-semibold">Ivory Zari</h4>
<p className="font-body-sm text-on-surface-variant">290 sold</p>
</div>
</div>
</div>
<button className="mt-4 font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors w-full text-center py-2 border border-primary/20 rounded">VIEW ALL COLLECTION</button>
</div>
</section>
{/*  Recent Orders Table  */}
<section>
<div className="bg-surface p-8 rounded-xl tinted-shadow ornamental-border border border-outline-variant/20 overflow-hidden">
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline-md text-headline-md text-on-surface">Recent Commissions</h3>
<button className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                                VIEW ALL <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
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
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
<td className="py-4 px-4 font-semibold text-primary">#ORD-9021</td>
<td className="py-4 px-4">Aanya Sharma</td>
<td className="py-4 px-4">₹12,500</td>
<td className="py-4 px-4">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container text-sm">
<span className="material-symbols-outlined text-[14px]">local_shipping</span> Shipped
                                            </span>
</td>
<td className="py-4 px-4 text-right text-on-surface-variant">Oct 24, 2024</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
<td className="py-4 px-4 font-semibold text-primary">#ORD-9020</td>
<td className="py-4 px-4">Rohan Kapoor</td>
<td className="py-4 px-4">₹8,900</td>
<td className="py-4 px-4">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant text-sm">
<span className="material-symbols-outlined text-[14px]">pending</span> Processing
                                            </span>
</td>
<td className="py-4 px-4 text-right text-on-surface-variant">Oct 24, 2024</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
<td className="py-4 px-4 font-semibold text-primary">#ORD-9019</td>
<td className="py-4 px-4">Priya Patel</td>
<td className="py-4 px-4">₹24,000</td>
<td className="py-4 px-4">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-sm">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Delivered
                                            </span>
</td>
<td className="py-4 px-4 text-right text-on-surface-variant">Oct 22, 2024</td>
</tr>
<tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest transition-colors">
<td className="py-4 px-4 font-semibold text-primary">#ORD-9018</td>
<td className="py-4 px-4">Vikram Singh</td>
<td className="py-4 px-4">₹15,200</td>
<td className="py-4 px-4">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant text-sm">
<span className="material-symbols-outlined text-[14px]">pending</span> Processing
                                            </span>
</td>
<td className="py-4 px-4 text-right text-on-surface-variant">Oct 22, 2024</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
</div>
</div>
</main>
{/*  Chart.js Initialization  */}




        </div>
    );
};

export default AdminDashboard;
