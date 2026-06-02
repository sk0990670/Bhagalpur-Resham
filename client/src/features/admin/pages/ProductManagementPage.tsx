import { Link } from 'react-router-dom';
import bhagalpurReshamBrandLogoAsset from '../../../assets/bhagalpur_resham_brand_logo.png';


const AdminProductManagement = () => {
    return (

        <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen w-full overflow-hidden flex bg-pattern-madhubani">
            
{/*  SideNavBar  */}
<nav className="bg-surface-container-low border-r border-outline-variant h-full w-64 fixed left-0 top-0 flex flex-col py-8 px-4 gap-4 z-40">
<div className="mb-8 px-4 flex flex-col items-center">
<div className="w-16 h-16 rounded-full bg-surface-container-highest mb-4 overflow-hidden border border-outline-variant flex items-center justify-center">
<img alt="Admin Avatar" className="w-full h-full object-cover" data-alt="Professional headshot of an administrator. Soft studio lighting. Elegant and approachable, conveying a sense of curated luxury and trust suitable for a premium heritage brand dashboard." src={bhagalpurReshamBrandLogoAsset}/>
</div>
<h2 className="font-headline-md text-[22px] leading-tight text-primary text-center font-bold">Bhagalpur Resham Admin</h2>
<p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">Luxury Silk Management</p>
</div>
<div className="flex flex-col gap-2 flex-grow overflow-y-auto">
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/dashboard">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>dashboard</span>
<span className="">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-semibold transition-all duration-200" to="/admin/inventory">
<span className="material-symbols-outlined">inventory_2</span>
<span className="">Inventory</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/orders">
<span className="material-symbols-outlined">shopping_cart</span>
<span className="">Orders</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="#">
<span className="material-symbols-outlined">groups</span>
<span className="">Artisan Network</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/analytics">
<span className="material-symbols-outlined">monitoring</span>
<span className="">Analytics</span>
</Link>
{/*  Additional user requested tabs  */}
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/customers">
<span className="material-symbols-outlined">person</span>
<span className="">Customers</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/coupons">
<span className="material-symbols-outlined">local_offer</span>
<span className="">Coupons</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/reviews">
<span className="material-symbols-outlined">reviews</span>
<span className="">Reviews</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200" to="/admin/content">
<span className="material-symbols-outlined">article</span>
<span className="">Content</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-all duration-200 mt-auto" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="">Settings</span>
</Link>
</div>
</nav>
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

{/*  Page Header  */}

<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
<div>
<h2 className="font-headline-xl text-headline-xl text-on-background mb-2">Product Management</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Manage your inventory, prices, and stock levels.</p>
</div>
<Link className="bg-primary-container text-on-primary hover:bg-primary transition-colors duration-300 px-6 py-3 rounded-DEFAULT font-label-caps text-label-caps uppercase flex items-center gap-2 shadow-sm" to="/admin/inventory/new">
<span className="material-symbols-outlined">add</span>
                Add New Product
            </Link>
</div>
{/*  Search and Filter Bar  */}
<div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
<div className="relative w-full md:w-96">
<span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border-b border-outline text-on-background font-body-md focus:border-primary focus:outline-none transition-colors rounded-t-DEFAULT" placeholder="Search products..." type="text"/>
</div>
<div className="flex gap-4 w-full md:w-auto">
<div className="relative flex-1 md:flex-none">
<select className="w-full appearance-none bg-surface-container-lowest border-b border-outline text-on-background font-body-md py-2 pl-4 pr-10 focus:border-primary focus:outline-none transition-colors rounded-t-DEFAULT">
<option>All Categories</option>
<option>Tussar</option>
<option>Bhagalpuri</option>
<option>Wedding</option>
</select>
<span className="material-symbols-outlined absolute right-2 top-1/2 transform -translate-y-1/2 text-outline pointer-events-none">arrow_drop_down</span>
</div>
<div className="relative flex-1 md:flex-none">
<select className="w-full appearance-none bg-surface-container-lowest border-b border-outline text-on-background font-body-md py-2 pl-4 pr-10 focus:border-primary focus:outline-none transition-colors rounded-t-DEFAULT">
<option>All Status</option>
<option>Active</option>
<option>Draft</option>
<option>Out of Stock</option>
</select>
<span className="material-symbols-outlined absolute right-2 top-1/2 transform -translate-y-1/2 text-outline pointer-events-none">arrow_drop_down</span>
</div>
</div>
</div>
{/*  Data Table Container  */}
<div className="bg-surface-container-lowest motif-border p-4 shadow-[0_4px_20px_rgba(139,0,0,0.04)]">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse min-w-[800px]">
<thead>
<tr className="border-b border-outline-variant bg-surface/50">
<th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Image</th>
<th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Saree Name</th>
<th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Category</th>
<th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Price</th>
<th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Stock</th>
<th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Status</th>
<th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-on-background divide-y divide-outline-variant/50">
{/*  Row 1  */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="p-4">
<div className="w-12 h-12 rounded-DEFAULT overflow-hidden border border-outline-variant">
<div className="w-full h-full bg-surface-variant" data-alt="A close-up photograph of a luxurious crimson red Tussar silk saree folded neatly. The fabric has a rich, slightly slubbed texture typical of raw silk, catching the light with a soft, warm sheen. A delicate gold thread border is visible at the edge. The lighting is soft and studio-quality, highlighting the deep maroon tones and artisanal quality. The aesthetic is premium, traditional Indian craft, fitting perfectly with a high-end fashion catalog." style={{ backgroundImage: 'url("https', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
</div>
</td>
<td className="p-4 font-story-serif text-story-serif font-medium">Crimson Tussar</td>
<td className="p-4 text-on-surface-variant">Tussar</td>
<td className="p-4">₹ 14,500</td>
<td className="p-4">12 in stock</td>
<td className="p-4">
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-fixed text-on-secondary-fixed">Active</span>
</td>
<td className="p-4 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-outline hover:text-primary transition-colors" title="View">
<span className="material-symbols-outlined text-lg">visibility</span>
</button>
<button className="p-2 text-outline hover:text-primary transition-colors" title="Edit">
<span className="material-symbols-outlined text-lg">edit</span>
</button>
<button className="p-2 text-outline hover:text-error transition-colors" title="Delete">
<span className="material-symbols-outlined text-lg">delete</span>
</button>
</div>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="p-4">
<div className="w-12 h-12 rounded-DEFAULT overflow-hidden border border-outline-variant">
<div className="w-full h-full bg-surface-variant" data-alt="A square thumbnail photograph of a deep midnight indigo blue silk saree. The silk is smooth and highly reflective, suggesting a fine Bhagalpuri weave. Intricate silver zari work is faintly visible in the weave pattern. The lighting is dramatic, emphasizing the dark, regal blue against a soft ivory background. The mood is elegant and timeless, suitable for a luxury ethnic wear digital catalog." style={{ backgroundImage: 'url("https', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
</div>
</td>
<td className="p-4 font-story-serif text-story-serif font-medium">Midnight Indigo Silk</td>
<td className="p-4 text-on-surface-variant">Bhagalpuri</td>
<td className="p-4">₹ 18,200</td>
<td className="p-4 text-error">Low Stock (2)</td>
<td className="p-4">
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-fixed text-on-secondary-fixed">Active</span>
</td>
<td className="p-4 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-outline hover:text-primary transition-colors" title="View">
<span className="material-symbols-outlined text-lg">visibility</span>
</button>
<button className="p-2 text-outline hover:text-primary transition-colors" title="Edit">
<span className="material-symbols-outlined text-lg">edit</span>
</button>
<button className="p-2 text-outline hover:text-error transition-colors" title="Delete">
<span className="material-symbols-outlined text-lg">delete</span>
</button>
</div>
</td>
</tr>
{/*  Row 3  */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="p-4">
<div className="w-12 h-12 rounded-DEFAULT overflow-hidden border border-outline-variant">
<div className="w-full h-full bg-surface-variant" data-alt="A detailed shot of an ivory and gold wedding saree, draped elegantly. The fabric is a rich, heavy silk adorned with traditional Madhubani inspired motifs woven in shiny gold thread. The ivory background has a subtle creamy warmth. The lighting is bright and festive, highlighting the intricate craftsmanship. The image conveys a sense of heritage luxury and celebration, intended for a premium e-commerce interface." style={{ backgroundImage: 'url("https', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
</div>
</td>
<td className="p-4 font-story-serif text-story-serif font-medium text-on-surface-variant">Ivory Heritage Weave</td>
<td className="p-4 text-on-surface-variant">Wedding</td>
<td className="p-4">₹ 24,000</td>
<td className="p-4 text-outline">0 in stock</td>
<td className="p-4">
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant">Draft</span>
</td>
<td className="p-4 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-outline hover:text-primary transition-colors" title="View">
<span className="material-symbols-outlined text-lg">visibility</span>
</button>
<button className="p-2 text-outline hover:text-primary transition-colors" title="Edit">
<span className="material-symbols-outlined text-lg">edit</span>
</button>
<button className="p-2 text-outline hover:text-error transition-colors" title="Delete">
<span className="material-symbols-outlined text-lg">delete</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Pagination (Simple)  */}
<div className="mt-6 flex justify-between items-center px-4 border-t border-outline-variant/50 pt-4">
<span className="text-sm text-on-surface-variant">Showing 1 to 3 of 45 products</span>
<div className="flex gap-2">
<button className="p-2 border border-outline-variant rounded-DEFAULT text-outline hover:text-primary hover:border-primary transition-colors disabled:opacity-50" disabled="">
<span className="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button className="p-2 border border-outline-variant rounded-DEFAULT text-outline hover:text-primary hover:border-primary transition-colors">
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>

                </div>
            </div>
        </main>
    </div>
    );
};

export default AdminProductManagement;
