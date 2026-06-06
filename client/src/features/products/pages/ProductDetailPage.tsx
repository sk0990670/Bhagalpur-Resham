import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductImage } from '../../../shared/utils/imageHelper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { productService } from '../../../shared/services/product.service';
import { useWishlist } from '../../wishlist/useWishlist';
import { useCart } from '../../cart/useCart';
import { useToast } from '../../../shared/hooks/useToast';
import { ToastContainer } from '../../../shared/components/Toast';

const ProductDetail = () => {
  const { sku } = useParams<{ sku: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { toasts, showToast, removeToast } = useToast();
  const { isInWishlist, toggleItem } = useWishlist(showToast);
  const { addToCart } = useCart(showToast);

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!sku) return;
      setIsLoading(true);
      setError('');
      try {
        const res = await productService.getProductBySku(sku);
        if (res.success) {
          setProduct(res.data);
        } else {
          setError(res.message || 'Failed to fetch product.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch product.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [sku]);

  if (isLoading) {
    return (
      <main className="pt-[100px] md:pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pt-[100px] md:pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <h2 className="text-2xl font-headline-md text-error mb-4">Product Not Found</h2>
        <p className="text-on-surface-variant mb-6">{error || 'The product you are looking for does not exist or has been removed.'}</p>
        <button onClick={() => navigate('/collections')} className="px-6 py-2 bg-primary text-on-primary rounded-md">
          Back to Collections
        </button>
      </main>
    );
  }

  const isWishlisted = product ? isInWishlist(product._id) : false;
  const primaryImage = getProductImage(product, 'fullBody');
  const allImages = [
    getProductImage(product, 'fullBody'),
    getProductImage(product, 'closeup'),
    getProductImage(product, 'micro')
  ];

  const handleAddToBag = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product._id, 1, product.name);
  };

  const handleAddToWishlist = () => {
    toggleItem(product._id, product.name);
  };

  return (
    <>
    <main className="pt-[100px] md:pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Product Showcase (Bento-style Gallery + Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-section-gap">
        {/* Image Gallery (Left - 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-[3/4] bg-surface-container-low overflow-hidden shadow-tinted relative border border-outline-variant/20 p-2">
            <div className="w-full h-full border border-secondary-container p-1 relative">
              <img 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in" 
                src={allImages[activeImageIndex]} 
              />
              {/* Artisan Badge (Authentic) */}
              {product.badge === 'Authentic Collection' && (
                <div className="absolute bottom-4 right-4 bg-surface/90 rounded-full p-2 flex items-center justify-center border border-secondary backdrop-blur-sm shadow-sm" title="Silk Mark Certified">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '24px' }}>verified</span>
                </div>
              )}
              {/* Tag Overlay (New Arrival / Best Seller) */}
              {(product.badge === 'New Arrival' || product.badge === 'Best Seller') && (
                <div className="absolute top-4 left-4 bg-surface/90 text-primary font-label-caps text-xs px-3 py-1.5 border border-primary/20 uppercase">
                  {product.badge}
                </div>
              )}
            </div>
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img: string, index: number) => (
                <div 
                  key={index} 
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square bg-surface-container-low overflow-hidden shadow-tinted border p-1 cursor-pointer transition-colors ${index === activeImageIndex ? 'border-primary' : 'border-outline-variant/20 hover:border-primary/50'}`}
                >
                  <img 
                    alt={`${product.name} - view ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    src={img} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info (Right - 5 cols) sticky */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-[120px] flex flex-col gap-6 p-6 bg-surface-container-low/50 shadow-tinted border border-outline-variant/20 backdrop-blur-sm">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] mb-2 uppercase">Handcrafted in Bhagalpur</p>
              <h1 className="font-headline-xl text-headline-xl text-primary mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                {product.discountPrice ? (
                  <>
                    <p className="font-body-lg text-body-lg text-on-surface-variant line-through opacity-70">₹ {product.price.toLocaleString()}</p>
                    <p className="font-body-lg text-body-lg text-primary font-semibold">₹ {product.discountPrice.toLocaleString()} <span className="text-sm ml-2 opacity-70 font-normal">Incl. of all taxes</span></p>
                  </>
                ) : (
                  <p className="font-body-lg text-body-lg text-on-surface-variant">₹ {product.price.toLocaleString()} <span className="text-sm ml-2 opacity-70">Incl. of all taxes</span></p>
                )}
              </div>
            </div>
            <div className="w-full h-px bg-outline-variant/30 my-2 relative flex justify-center items-center">
              <span className="material-symbols-outlined text-secondary absolute bg-surface-container-low px-2" style={{ fontSize: '16px' }}>filter_vintage</span>
            </div>
            <p className="font-story-serif text-story-serif text-on-surface-variant leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">SKU</span>
                <span className="font-body-md text-on-surface">{product.sku}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Fabric</span>
                <span className="font-body-md text-on-surface">Pure Tussar Silk</span>
              </div>
              {product.attributes?.weaveType && (
                <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Weave Type</span>
                  <span className="font-body-md text-on-surface">{product.attributes.weaveType}</span>
                </div>
              )}
              {product.careInstructions && (
                <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Care</span>
                  <span className="font-body-md text-on-surface">{product.careInstructions}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button 
                onClick={handleAddToBag}
                disabled={product.stock <= 0}
                className="flex-grow bg-primary-container text-[#FFD700] hover:bg-primary transition-colors py-4 px-6 font-label-caps text-label-caps tracking-widest flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-container"
              >
                {product.stock > 0 ? 'ADD TO BAG' : 'OUT OF STOCK'}
                <span className="material-symbols-outlined text-[18px]">local_mall</span>
              </button>
              <button
                onClick={handleAddToWishlist}
                className="w-full bg-transparent border font-label-caps text-label-caps py-4 transition-all duration-300 hover:bg-surface-variant flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  borderColor: isWishlisted ? '#C41E3A' : undefined,
                  color: isWishlisted ? '#C41E3A' : undefined,
                }}
              >
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                <span
                  className="material-symbols-outlined transition-all duration-200"
                  style={{
                    fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                    color: isWishlisted ? '#C41E3A' : 'currentColor',
                  }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Accordion for more details */}
            <div className="mt-4 border border-outline-variant/30">
              <details className="group">
                <summary className="flex justify-between items-center font-label-caps text-label-caps p-4 cursor-pointer text-primary hover:bg-surface-variant transition-colors">
                  Shipping & Returns
                  <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-body-md text-on-surface-variant bg-surface-container-low/50">
                  Complimentary express shipping globally. As this is a handcrafted piece, slight irregularities are part of its charm. Returns accepted within 14 days in original condition.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </main>
    <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default ProductDetail;
