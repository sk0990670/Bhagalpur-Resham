import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import { productService } from '../../../shared/services/product.service';
import { useWishlist } from '../../wishlist/useWishlist';
import { useToast } from '../../../shared/hooks/useToast';
import { ToastContainer } from '../../../shared/components/Toast';

const ProductSearch = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid-4' | 'grid-2'>('grid-4');
  const [sort, setSort] = useState('newest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const [filters, setFilters] = useState({
    weaveType: [] as string[],
    color: [] as string[],
    occasion: [] as string[]
  });

  const { toasts, showToast, removeToast } = useToast();
  const { isInWishlist, toggleItem } = useWishlist(showToast);

  // Load view mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('searchViewMode');
    if (savedMode === 'grid-2' || savedMode === 'grid-4') {
      setViewMode(savedMode);
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {};
        if (debouncedSearchQuery) params.search = debouncedSearchQuery;
        if (filters.weaveType.length > 0) params.weaveType = filters.weaveType.join(',');
        if (filters.color.length > 0) params.color = filters.color.join(',');
        if (filters.occasion.length > 0) params.occasion = filters.occasion.join(',');
        if (sort !== 'newest') params.sort = sort;

        const res = await productService.getProducts(params);
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch search results', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedSearchQuery, filters, sort]);

  const handleWeaveChange = (weave: string) => {
    setFilters(prev => ({
      ...prev,
      weaveType: prev.weaveType.includes(weave) 
        ? prev.weaveType.filter(w => w !== weave)
        : [...prev.weaveType, weave]
    }));
  };

  const handleColorChange = (color: string) => {
    setFilters(prev => ({
      ...prev,
      color: prev.color.includes(color)
        ? prev.color.filter(c => c !== color)
        : [...prev.color, color]
    }));
  };

  const handleOccasionChange = (occasion: string) => {
    setFilters(prev => ({
      ...prev,
      occasion: [occasion]
    }));
  };

  const handleViewModeChange = (mode: 'grid-4' | 'grid-2') => {
    setViewMode(mode);
    localStorage.setItem('searchViewMode', mode);
  };

  const handleSortSelect = (val: string) => {
    setSort(val);
    setIsSortDropdownOpen(false);
  };

  // Close dropdown on click outside logic could be added here if needed

  return (
    <>
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        {/* Search/Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Discover Your Heritage</h1>
          <div className="max-w-2xl mx-auto relative group">
            <input 
              className="w-full bg-transparent border-0 border-b border-primary text-center font-story-serif text-story-serif py-4 focus:ring-0 focus:border-b-2 transition-all placeholder:text-on-surface-variant/50 outline-none" 
              placeholder="Search for heritage silk..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span 
              className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" 
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              search
            </span>
          </div>
          {debouncedSearchQuery && (
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-6">
              Search Results for "{debouncedSearchQuery}"
            </p>
          )}
          <p className="font-label-caps text-label-caps text-on-surface-variant mt-2">
            {isLoading ? "Searching..." : `${products.length} Results Found`}
          </p>
        </section>
        
        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Sidebar Filters */}
          <ProductFilterSidebar 
            filters={filters}
            onWeaveChange={handleWeaveChange}
            onColorChange={handleColorChange}
            onOccasionChange={handleOccasionChange}
          />
          
          {/* Product Grid */}
          <section className="w-full lg:w-3/4">
            {/* Sorting & Top Actions */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/30">
              <div className="relative flex items-center space-x-2 z-20">
                <span className="font-label-caps text-label-caps text-on-surface">Sort By:</span>
                <div 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  <span className="font-body-md text-body-md text-primary">
                    {sort === 'authentic' && 'Authentic Collection'}
                    {sort === 'best_seller' && 'Best Sellers'}
                    {sort === 'newest' && 'New Arrivals'}
                    {sort === 'price_desc' && 'Price: High to Low'}
                    {sort === 'price_asc' && 'Price: Low to High'}
                  </span>
                  <svg className={`w-4 h-4 text-primary transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>

                {isSortDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-outline-variant/30 ambient-shadow py-2 z-30">
                    {[
                      { value: 'newest', label: 'New Arrivals' },
                      { value: 'authentic', label: 'Authentic Collection' },
                      { value: 'best_seller', label: 'Best Sellers' },
                      { value: 'price_desc', label: 'Price: High to Low' },
                      { value: 'price_asc', label: 'Price: Low to High' },
                    ].map((option) => (
                      <div 
                        key={option.value}
                        className={`px-4 py-2 font-body-md text-body-md cursor-pointer hover:bg-surface-variant/50 transition-colors ${sort === option.value ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}
                        onClick={() => handleSortSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewModeChange('grid-4')}
                  className={`p-2 rounded-sm transition-colors cursor-pointer ${viewMode === 'grid-4' ? 'text-primary bg-surface-variant' : 'text-on-surface-variant hover:text-primary'}`}
                  aria-label="4-Column Grid View"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>grid_view</span>
                </button>
                <button 
                  onClick={() => handleViewModeChange('grid-2')}
                  className={`p-2 rounded-sm transition-colors cursor-pointer ${viewMode === 'grid-2' ? 'text-primary bg-surface-variant' : 'text-on-surface-variant hover:text-primary'}`}
                  aria-label="2-Column Grid View"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>view_agenda</span>
                </button>
              </div>
            </div>
            
            {/* Grid */}
            <div className={`grid gap-6 ${viewMode === 'grid-4' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2'}`}>
              
              {isLoading ? (
                // Skeletons
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skel-${i}`} className="animate-pulse">
                    <div className="bg-surface-variant aspect-[4/5] mb-3"></div>
                    <div className="h-4 bg-surface-variant mx-auto w-3/4 mb-2"></div>
                    <div className="h-3 bg-surface-variant mx-auto w-1/2 mb-4"></div>
                    <div className="h-5 bg-surface-variant mx-auto w-1/4"></div>
                  </div>
                ))
              ) : products.length === 0 ? (
                // Empty State
                <div className="col-span-full py-16 text-center">
                  <span className="material-symbols-outlined text-outline-variant mb-4" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0" }}>search_off</span>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">No matching heritage pieces found.</h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
                    Try adjusting your search or filters to discover our beautiful collection of authentic handwoven silk.
                  </p>
                  <Link to="/collections" className="inline-block bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
                    Return to Collections
                  </Link>
                </div>
              ) : (
                // Products
                products.map((product) => {
                  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
                  
                  return (
                    <Link key={product._id} to={`/product/${product.slug}`} className="block group relative border-ornamental ambient-shadow transition-transform duration-500 hover:-translate-y-1 bg-surface-container-lowest p-3">
                      <div className="relative overflow-hidden aspect-[4/5] mithila-border p-1 bg-surface-container-low mb-3">
                        {primaryImage ? (
                          <img 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={primaryImage.url}
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline">image</span>
                          </div>
                        )}
                        {/* Artisan Badge (Authentic) */}
                        {product.badge === 'Authentic Collection' && (
                          <div className="absolute top-3 right-3 bg-surface/90 rounded-full p-1.5 backdrop-blur-sm shadow-sm" title="Silk Mark Certified">
                            <span className="material-symbols-outlined text-secondary" style={{ fontSize: '14px' }}>verified</span>
                          </div>
                        )}
                        {/* Tag (New Arrival / Best Seller) */}
                        {(product.badge === 'New Arrival' || product.badge === 'Best Seller') && (
                          <div className="absolute top-3 left-3 bg-surface/90 text-primary font-label-caps text-[9px] px-2 py-1 border border-primary/20 uppercase">
                            {product.badge}
                          </div>
                        )}
                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                          <button className="bg-primary/90 text-on-primary font-label-caps text-label-caps px-4 py-2 text-xs tracking-widest hover:bg-primary transition-colors cursor-pointer">QUICK VIEW</button>
                        </div>
                      </div>
                      <div className="text-center px-1">
                        <h3 className="font-headline-md text-headline-md text-primary text-lg mb-1 truncate">{product.name}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-2 text-sm">{product.weaveType}</p>
                        <div className="flex justify-between items-center border-t border-outline-variant/30 pt-2 mt-2">
                          <span className="font-body-lg text-body-lg font-semibold text-on-surface text-base">₹ {product.price?.toLocaleString()}</span>
                          <button
                            aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                            className="cursor-pointer transition-transform hover:scale-110 active:scale-125 focus:outline-none"
                            onClick={(e) => { e.preventDefault(); toggleItem(product._id, product.name); }}
                            style={{ lineHeight: 1 }}
                          >
                            <span
                              className="material-symbols-outlined transition-all duration-200"
                              style={{
                                fontSize: '22px',
                                fontVariationSettings: isInWishlist(product._id) ? "'FILL' 1" : "'FILL' 0",
                                color: isInWishlist(product._id) ? '#C41E3A' : '#6B7280',
                              }}
                            >
                              favorite
                            </span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
              
            </div>
            
            {/* Pagination (Show only if products exist) */}
            {!isLoading && products.length > 0 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button aria-label="Previous page" className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary font-label-caps cursor-pointer">1</button>
                <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors font-label-caps cursor-pointer">2</button>
                <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors font-label-caps cursor-pointer">3</button>
                <span className="text-on-surface-variant px-2">...</span>
                <button aria-label="Next page" className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
            
          </section>
        </div>
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default ProductSearch;
