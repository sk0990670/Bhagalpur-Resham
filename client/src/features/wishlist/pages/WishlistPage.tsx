import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { wishlistService } from '../../../shared/services/wishlist.service';
import { useWishlist } from '../useWishlist';
import { useToast } from '../../../shared/hooks/useToast';
import { ToastContainer } from '../../../shared/components/Toast';
import { useCart } from '../../cart/useCart';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toasts, showToast, removeToast } = useToast();
  const { toggleItem, fetchWishlist } = useWishlist(showToast);
  const { addToCart } = useCart(showToast);

  // Redirect guests to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: { pathname: '/wishlist' },
          message: 'Please login to view your saved sarees.',
        },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  // Fetch full wishlist with product details
  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await wishlistService.getWishlist();
        // Backend: { data: { items: [{ product: { _id, name, images, ... }, addedAt }] } }
        const rawItems = res.data?.items || res.items || [];
        const products = rawItems.map((item: any) => item.product || item).filter(Boolean);
        setWishlistProducts(products);
        // Sync IDs into Redux
        await fetchWishlist();
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  const handleRemove = async (product: any) => {
    await toggleItem(product._id, product.name);
    setWishlistProducts((prev) => prev.filter((p) => p._id !== product._id));
  };

  const handleMoveToBag = async (product: any) => {
    if (product.stock <= 0) {
      showToast('Product is out of stock', 'error');
      return;
    }
    const success = await addToCart(product._id, 1, product.name);
    if (success) {
      await toggleItem(product._id, product.name);
      setWishlistProducts((prev) => prev.filter((p) => p._id !== product._id));
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <main className="flex-grow pt-12 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-4">Your Saved Masterpieces</h1>
          <p className="font-story-serif text-story-serif text-on-surface-variant max-w-2xl mx-auto">
            A curated selection of heritage silks you've admired. Ready to become part of your collection.
          </p>
          <div className="flex items-center justify-center mt-8 opacity-60">
            <div className="h-px w-24 bg-secondary-container"></div>
            <span className="material-symbols-outlined text-secondary mx-4 text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>local_florist</span>
            <div className="h-px w-24 bg-secondary-container"></div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6" style={{ fontVariationSettings: "'FILL' 0" }}>favorite_border</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Your collection is waiting</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-8">
              Discover our latest masterpieces and save your favorites here.
            </p>
            <Link
              to="/collections"
              className="border border-secondary-container text-primary px-8 py-3 font-label-caps text-label-caps hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {wishlistProducts.map((product) => {
              const primaryImage = product.images?.fullBody || product.images?.[0]?.url || product.images?.[0] || '';
              return (
                <div key={product._id} className="bg-surface-container-lowest masterpiece-card ambient-shadow flex flex-col group transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative p-4 flex-grow">
                    {/* Image */}
                    <Link to={`/product/${product.sku}`} className="block">
                      <div className="aspect-[3/4] overflow-hidden bg-surface-variant relative z-0">
                        {primaryImage ? (
                          <img
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src={primaryImage}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-outline-variant">
                            <span className="material-symbols-outlined text-5xl">image</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    {/* Remove Action */}
                    <button
                      aria-label="Remove from wishlist"
                      onClick={() => handleRemove(product)}
                      className="absolute top-6 right-6 z-20 text-on-surface-variant bg-surface/80 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-error hover:bg-error-container cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
                    </button>
                    {/* Badge */}
                    {product.badge && product.badge !== 'Normal' && (
                      <div className="absolute top-6 left-6 z-20 bg-surface/90 text-primary font-label-caps text-[9px] px-2 py-1 border border-primary/20 uppercase">
                        {product.badge}
                      </div>
                    )}
                    {/* Content */}
                    <div className="pt-6 pb-2 text-center relative z-20 bg-surface-container-lowest mt-[-20px] mx-4 border-t border-outline-variant">
                      <Link to={`/product/${product.sku}`} className="hover:text-secondary transition-colors">
                        <h3 className="font-headline-md text-[20px] leading-tight text-primary mb-2">{product.name}</h3>
                      </Link>
                      <p className="font-body-md text-on-surface-variant mb-2 text-sm">{product.weaveType}</p>
                      <p className="font-body-md text-on-surface-variant mb-4 font-semibold tracking-wide">
                        {product.discountPrice ? (
                          <>
                            <span className="line-through opacity-60 mr-2">₹{product.price?.toLocaleString()}</span>
                            ₹{product.discountPrice?.toLocaleString()}
                          </>
                        ) : (
                          `₹${product.price?.toLocaleString()}`
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Action */}
                  <div className="px-8 pb-8 z-20 relative bg-surface-container-lowest flex flex-col gap-2">
                    <button
                      onClick={() => handleMoveToBag(product)}
                      disabled={product.stock <= 0}
                      className="w-full bg-primary-container text-secondary-fixed py-3 font-label-caps text-label-caps hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {product.stock > 0 ? 'MOVE TO BAG' : 'OUT OF STOCK'}
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_mall</span>
                    </button>
                    <button
                      onClick={() => handleRemove(product)}
                      className="w-full border border-outline-variant text-on-surface-variant py-2 font-label-caps text-[11px] hover:border-error hover:text-error transition-colors duration-200 flex justify-center items-center gap-1 cursor-pointer"
                    >
                      REMOVE
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default WishlistPage;
