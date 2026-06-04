import AdminSidebar from '../../../shared/components/AdminSidebar';


const AdminOrdersManagement = () => {
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


{/*  Header Section  */}
<div className="mb-12">
<h2 className="font-headline-xl text-headline-xl text-primary mb-2">Order Management</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">Oversee the journey of every handcrafted masterpiece from loom to patron.</p>
</div>
{/*  Filters & Actions  */}
<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 p-6 bg-surface-container-low rounded-xl border border-outline-variant">
<div className="flex-1 w-full max-w-md relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg font-body-md text-on-surface transition-colors shadow-sm" placeholder="Search Order ID or Customer..." type="text"/>
</div>
<div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
<div className="relative">
<select className="appearance-none bg-surface border border-outline-variant pl-4 pr-10 py-3 rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm cursor-pointer">
<option value="all">All Statuses</option>
<option value="processing">Processing</option>
<option value="shipped">Shipped</option>
<option value="delivered">Delivered</option>
<option value="cancelled">Cancelled</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
</div>
<div className="relative">
<select className="appearance-none bg-surface border border-outline-variant pl-4 pr-10 py-3 rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm cursor-pointer">
<option value="30">Last 30 Days</option>
<option value="90">Last 3 months</option>
<option value="year">This Year</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">calendar_today</span>
</div>
<button className="bg-primary hover:bg-primary-container text-on-primary px-6 py-3 rounded-lg font-label-caps text-label-caps transition-colors shadow-sm shadow-primary/20 flex items-center gap-2">
<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                        Export
                    </button>
</div>
</div>
{/*  Orders Table (Bento Style Container)  */}
<div className="motif-border rounded-xl">
<div className="motif-border-inner rounded-lg overflow-x-auto shadow-[0_4px_20px_-4px_rgba(128,0,32,0.04)]">
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
{/*  Row 1  */}
<tr className="hover:bg-surface-container-lowest transition-colors group cursor-pointer">
<td className="p-6 font-semibold text-primary">#BR-99021</td>
<td className="p-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold">AS</div>
<div>
<p className="font-medium text-on-surface">Aanya Sharma</p>
<p className="text-sm text-on-surface-variant">aanya.s@example.com</p>
</div>
</div>
</td>
<td className="p-6 text-on-surface-variant">12 Oct, 2023</td>
<td className="p-6">
  <div className="font-medium text-on-surface">₹ 75,475</div>
  <div className="text-xs text-on-surface-variant mt-1 space-y-0.5">
    <div>Method: Speed Post</div>
    <div className="text-primary">Shipping Paid: ₹85</div>
    <div>COD Amount: ₹75,390</div>
  </div>
</td>
<td className="p-6">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-secondary-container/30 text-on-secondary-container border border-secondary-container">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
                                        Processing
                                    </span>
</td>
<td className="p-6">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="View Order">
<span className="material-symbols-outlined">visibility</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Update Status">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Generate Invoice">
<span className="material-symbols-outlined">receipt_long</span>
</button>
</div>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-surface-container-lowest transition-colors group cursor-pointer">
<td className="p-6 font-semibold text-primary">#BR-99020</td>
<td className="p-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold">RK</div>
<div>
<p className="font-medium text-on-surface">Rohan Kapoor</p>
<p className="text-sm text-on-surface-variant">rohan.k@example.com</p>
</div>
</div>
</td>
<td className="p-6 text-on-surface-variant">10 Oct, 2023</td>
<td className="p-6 font-medium">₹ 28,000</td>
<td className="p-6">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
<span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Shipped
                                    </span>
</td>
<td className="p-6">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="View Order">
<span className="material-symbols-outlined">visibility</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Update Status">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Generate Invoice">
<span className="material-symbols-outlined">receipt_long</span>
</button>
</div>
</td>
</tr>
{/*  Row 3  */}
<tr className="hover:bg-surface-container-lowest transition-colors group cursor-pointer">
<td className="p-6 font-semibold text-primary">#BR-99019</td>
<td className="p-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold">MD</div>
<div>
<p className="font-medium text-on-surface">Meera Desai</p>
<p className="text-sm text-on-surface-variant">meera.d@example.com</p>
</div>
</div>
</td>
<td className="p-6 text-on-surface-variant">08 Oct, 2023</td>
<td className="p-6 font-medium">₹ 9,200</td>
<td className="p-6">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Delivered
                                    </span>
</td>
<td className="p-6">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="View Order">
<span className="material-symbols-outlined">visibility</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Update Status">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Generate Invoice">
<span className="material-symbols-outlined">receipt_long</span>
</button>
</div>
</td>
</tr>
{/*  Row 4  */}
<tr className="hover:bg-surface-container-lowest transition-colors group cursor-pointer bg-error-container/10">
<td className="p-6 font-semibold text-primary">#BR-99018</td>
<td className="p-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold">VJ</div>
<div>
<p className="font-medium text-on-surface">Vikram Joshi</p>
<p className="text-sm text-on-surface-variant">vikram.j@example.com</p>
</div>
</div>
</td>
<td className="p-6 text-on-surface-variant">05 Oct, 2023</td>
<td className="p-6 font-medium">₹ 42,000</td>
<td className="p-6">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-error-container text-on-error-container border border-outline-variant">
<span className="w-2 h-2 rounded-full bg-error"></span>
                                        Cancelled
                                    </span>
</td>
<td className="p-6">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="View Order">
<span className="material-symbols-outlined">visibility</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-colors" title="Update Status">
<span className="material-symbols-outlined">edit</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/*  Pagination  */}
<div className="mt-8 flex justify-between items-center text-on-surface-variant font-body-md">
<p className="">Showing 1 to 10 of 124 orders</p>
<div className="flex items-center gap-2">
<button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-50 transition-colors" disabled={true}>
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-medium flex items-center justify-center">1</button>
<button className="w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-high text-on-surface font-medium flex items-center justify-center transition-colors">2</button>
<button className="w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-high text-on-surface font-medium flex items-center justify-center transition-colors">3</button>
<span className="px-2">...</span>
<button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>

                </div>
            </div>
        </main>
    </div>
    );
};

export default AdminOrdersManagement;
