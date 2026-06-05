import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../shared/services/product.service';
import { useWishlist } from '../../wishlist/useWishlist';
import { useToast } from '../../../shared/hooks/useToast';
import { ToastContainer } from '../../../shared/components/Toast';
import ProductFilterSidebar from '../components/ProductFilterSidebar';



const Collections = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    weaveType: [] as string[],
    color: [] as string[],
    occasion: [] as string[], // Using array for occasion too to allow multiple or deselection, though UI is currently radio
  });
  const [sort, setSort] = useState('newest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);



  const { toasts, showToast, removeToast } = useToast();
  const { isInWishlist, toggleItem } = useWishlist(showToast);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {};
        if (filters.weaveType.length > 0) params.weaveType = filters.weaveType.join(',');
        if (filters.color.length > 0) params.color = filters.color.join(',');
        if (filters.occasion.length > 0) params.occasion = filters.occasion.join(',');
        if (sort !== 'newest') params.sort = sort;

        const res = await productService.getProducts(params);
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filters, sort]);

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
      // Radio button behavior but stored in array for API format
      occasion: [occasion]
    }));
  };

  return (
    <>
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      {/* Hero Section */}
      <header className="mb-16 text-center">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">The Silk Route</h1>
        <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">Explore our curated collections of masterfully handwoven Tussar, Bhagalpuri, and Matka silks.</p>
        <div className="mt-8 flex justify-center">
          <svg fill="none" height="20" viewBox="0 0 200 20" width="200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10H190" stroke="#735c00" strokeWidth="1"></path>
            <circle cx="100" cy="10" fill="#8B0000" r="4"></circle>
            <circle cx="90" cy="10" fill="#735c00" r="2"></circle>
            <circle cx="110" cy="10" fill="#735c00" r="2"></circle>
          </svg>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Filter Sidebar */}
        <ProductFilterSidebar 
          filters={filters}
          onWeaveChange={handleWeaveChange}
          onColorChange={handleColorChange}
          onOccasionChange={handleOccasionChange}
        />

        {/* Product Grid */}
        <section className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <span className="font-body-md text-body-md text-on-surface-variant">Showing {products.length} items</span>
            <div className="relative flex items-center space-x-2 border-b border-primary/20 pb-1 z-20">
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
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-outline-variant/50 rounded shadow-lg z-20 overflow-hidden">
                    {[
                      { value: 'authentic', label: 'Authentic Collection' },
                      { value: 'best_seller', label: 'Best Sellers' },
                      { value: 'newest', label: 'New Arrivals' },
                      { value: 'price_desc', label: 'Price: High to Low' },
                      { value: 'price_asc', label: 'Price: Low to High' }
                    ].map(option => (
                      <div 
                        key={option.value}
                        className={`px-4 py-3 cursor-pointer hover:bg-surface-variant transition-colors font-body-md text-body-md ${sort === option.value ? 'bg-surface-container text-primary font-semibold' : 'text-on-surface'}`}
                        onClick={() => {
                          setSort(option.value);
                          setIsSortDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Changed gap to gap-6 for tight grid, columns updated to match requirements */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-body-lg">
                Loading collections...
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-body-lg">
                No products found in this collection.
              </div>
            ) : products.map((product) => {
              const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
              
              return (
                <Link key={product._id} to={`/product/${product.sku}`} className="block group relative border-ornamental ambient-shadow transition-transform duration-500 hover:-translate-y-1 bg-surface-container-lowest p-3">
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
            })}
          </div>

          {/* Pagination */}
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
        </section>
      </div>
    </main>
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </>
  );
};

export default Collections;
