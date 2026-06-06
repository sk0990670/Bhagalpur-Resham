import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductImage } from '../../../shared/utils/imageHelper';
import { productService } from '../../../shared/services/product.service';
import AdminSidebar from '../../../shared/components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';

const AdminProductManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [occasionFilter, setOccasionFilter] = useState('All Occasions');
    const [statusFilter, setStatusFilter] = useState('All Status');

    const [isOccasionOpen, setIsOccasionOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const res = await productService.getAdminProducts();
                if (res.success || res.data) {
                    setProducts(res.data || res);
                }
            } catch (err: any) {
                setError('Failed to fetch products');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                setProducts(products.filter(p => p._id !== id));
            } catch (err: any) {
                alert('Failed to delete product');
            }
        }
    };

    const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            await productService.updateProduct(id, { isActive: !currentStatus });
            setProducts(products.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p));
        } catch (err: any) {
            alert('Failed to update product visibility');
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
        if (searchQuery && !matchesSearch) return false;

        if (occasionFilter !== 'All Occasions' && product.attributes?.occasion !== occasionFilter) {
            return false;
        }

        const isDraft = !product.isActive;
        const isOutOfStock = product.stock <= 0 && product.isActive;
        const isActive = product.isActive && product.stock > 0;

        if (statusFilter === 'Active' && !isActive) return false;
        if (statusFilter === 'Draft' && !isDraft) return false;
        if (statusFilter === 'Out of Stock' && !isOutOfStock) return false;

        return true;
    });

    if (error) {
        return (
            <div className="min-h-screen bg-[#FFF9EC] w-full flex font-body-md text-[#5A403C]">
                <AdminSidebar />
                <main className="ml-64 flex-1 flex items-center justify-center">
                    <p className="text-error">{error}</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF9EC] w-full flex font-body-md text-[#5A403C]">
            <AdminSidebar />
            <main className="ml-64 flex-1 flex flex-col h-screen">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 bg-[#FFF9EC]">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <AdminHeader />

                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                            <div>
                                <h2 className="font-headline-xl text-headline-xl text-on-background mb-2">Product Management</h2>
                                <p className="font-body-md text-body-md text-on-surface-variant">Manage your inventory, prices, and stock levels.</p>
                            </div>
                            <Link
                                className="bg-primary-container text-on-primary hover:bg-primary transition-colors duration-300 px-6 py-3 rounded-DEFAULT font-label-caps text-label-caps uppercase flex items-center gap-2 shadow-sm"
                                to="/admin/inventory/new"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add New Product
                            </Link>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border-b border-outline text-on-background font-body-md focus:border-primary focus:outline-none transition-colors rounded-t-DEFAULT"
                                    placeholder="Search products..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                {/* Occasion Filter */}
                                <div className="relative flex-1 md:flex-none">
                                    <div
                                        className="w-full min-w-[160px] bg-surface-container-lowest border-b border-outline text-on-background font-body-md py-2 pl-4 pr-3 cursor-pointer flex items-center justify-between rounded-t-DEFAULT"
                                        onClick={() => setIsOccasionOpen(!isOccasionOpen)}
                                    >
                                        <span className="truncate">{occasionFilter}</span>
                                        <span className={`material-symbols-outlined text-outline transition-transform ${isOccasionOpen ? 'rotate-180' : ''}`}>arrow_drop_down</span>
                                    </div>
                                    {isOccasionOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsOccasionOpen(false)}></div>
                                            <div className="absolute top-full left-0 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded shadow-lg z-20 overflow-hidden">
                                                {['All Occasions', 'Festive', 'Wedding', 'Casual'].map(opt => (
                                                    <div
                                                        key={opt}
                                                        className={`px-4 py-2 cursor-pointer hover:bg-surface-variant transition-colors ${occasionFilter === opt ? 'bg-surface-variant text-primary font-semibold' : ''}`}
                                                        onClick={() => { setOccasionFilter(opt); setIsOccasionOpen(false); }}
                                                    >
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* Status Filter */}
                                <div className="relative flex-1 md:flex-none">
                                    <div
                                        className="w-full min-w-[140px] bg-surface-container-lowest border-b border-outline text-on-background font-body-md py-2 pl-4 pr-3 cursor-pointer flex items-center justify-between rounded-t-DEFAULT"
                                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                                    >
                                        <span className="truncate">{statusFilter}</span>
                                        <span className={`material-symbols-outlined text-outline transition-transform ${isStatusOpen ? 'rotate-180' : ''}`}>arrow_drop_down</span>
                                    </div>
                                    {isStatusOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)}></div>
                                            <div className="absolute top-full left-0 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded shadow-lg z-20 overflow-hidden">
                                                {['All Status', 'Active', 'Draft', 'Out of Stock'].map(opt => (
                                                    <div
                                                        key={opt}
                                                        className={`px-4 py-2 cursor-pointer hover:bg-surface-variant transition-colors ${statusFilter === opt ? 'bg-surface-variant text-primary font-semibold' : ''}`}
                                                        onClick={() => { setStatusFilter(opt); setIsStatusOpen(false); }}
                                                    >
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-surface-container-lowest motif-border p-4 shadow-[0_4px_20px_rgba(139,0,0,0.04)]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-outline-variant bg-surface/50">
                                            <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Image</th>
                                            <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Weave Type</th>
                                            <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Occasion</th>
                                            <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Price</th>
                                            <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Stock</th>
                                            <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Status</th>
                                            <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-body-md text-on-background divide-y divide-outline-variant/50">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-on-surface-variant">Loading products...</td>
                                            </tr>
                                        ) : filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-on-surface-variant">No products found. Add a new product to get started.</td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map((product) => {
                                                const isDraft = !product.isActive;
                                                const isOutOfStock = product.stock <= 0 && product.isActive;
                                                const isActive = product.isActive && product.stock > 0;

                                                let statusBadge = null;
                                                if (isDraft) {
                                                    statusBadge = <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant">Draft</span>;
                                                } else if (isOutOfStock) {
                                                    statusBadge = <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-container text-on-error-container">Out of Stock</span>;
                                                } else if (isActive) {
                                                    statusBadge = <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-fixed text-on-secondary-fixed">Active</span>;
                                                }

                                                // New object-based image schema: { fullBody, closeup, micro }
                                                const primaryImage = getProductImage(product, 'fullBody');

                                                return (
                                                    <tr key={product._id} className="hover:bg-surface-container-low transition-colors group">
                                                        <td className="p-4">
                                                            <div className="w-12 h-12 rounded-DEFAULT overflow-hidden border border-outline-variant">
                                                                {primaryImage ? (
                                                                    <div
                                                                        className="w-full h-full bg-surface-variant"
                                                                        style={{ backgroundImage: `url("${primaryImage}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                                                                        <span className="material-symbols-outlined text-outline">image</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-story-serif text-story-serif font-medium">
                                                            <div>{product.weaveType || 'N/A'}</div>
                                                            <div className="text-xs text-on-surface-variant font-body-sm">{product.name}</div>
                                                            <div className="text-xs font-mono text-primary/70 mt-0.5">{product.sku}</div>
                                                        </td>
                                                        <td className="p-4 text-on-surface-variant">{product.attributes?.occasion || 'N/A'}</td>
                                                        <td className="p-4">₹ {product.price?.toLocaleString()}</td>
                                                        <td className={`p-4 ${isOutOfStock ? 'text-error' : (product.stock < 5 ? 'text-error font-bold' : '')}`}>
                                                            {isOutOfStock ? '0 in stock' : (product.stock < 5 ? `Low Stock (${product.stock})` : `${product.stock} in stock`)}
                                                        </td>
                                                        <td className="p-4">{statusBadge}</td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleToggleVisibility(product._id, product.isActive)}
                                                                    className="p-2 text-outline hover:text-primary transition-colors"
                                                                    title={product.isActive ? 'Hide Product' : 'Show Product'}
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">{product.isActive ? 'visibility' : 'visibility_off'}</span>
                                                                </button>
                                                                <Link to={`/admin/inventory/edit/${product._id}`} className="p-2 text-outline hover:text-primary transition-colors" title="Edit">
                                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                                </Link>
                                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-outline hover:text-error transition-colors" title="Delete">
                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {!isLoading && products.length > 0 && (
                                <div className="mt-6 flex justify-between items-center px-4 border-t border-outline-variant/50 pt-4">
                                    <span className="text-sm text-on-surface-variant">Showing 1 to {products.length} of {products.length} products</span>
                                    <div className="flex gap-2">
                                        <button className="p-2 border border-outline-variant rounded-DEFAULT text-outline hover:text-primary hover:border-primary transition-colors disabled:opacity-50" disabled>
                                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                                        </button>
                                        <button className="p-2 border border-outline-variant rounded-DEFAULT text-outline hover:text-primary hover:border-primary transition-colors disabled:opacity-50" disabled>
                                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProductManagement;
