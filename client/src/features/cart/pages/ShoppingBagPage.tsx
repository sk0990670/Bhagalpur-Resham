import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../useCart';
import { getProductImage } from '../../../shared/utils/imageHelper';
import { useToast } from '../../../shared/hooks/useToast';
import { ToastContainer } from '../../../shared/components/Toast';

const ShoppingBag = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { toasts, showToast, removeToast } = useToast();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  const estimatedTax = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + (price * item.quantity * ((item.product.gstPercent || 5) / 100));
  }, 0);

  const grandTotal = subtotal + estimatedTax;

  const hasOutOfStockItems = cartItems.some(item => item.product.stock === 0 || item.quantity > item.product.stock);

  const formatAddedDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <>
      <main className="flex-grow pt-16 md:pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <h1 className="font-display-lg text-headline-xl text-primary mb-12 text-center md:text-left">Your Curated Selection</h1>
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Your bag is empty</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-8">
              Discover our latest masterpieces and add your favorites to the bag.
            </p>
            <Link
              to="/collections"
              className="border border-secondary-container text-primary px-8 py-3 font-label-caps text-label-caps hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Cart Items (Left Column) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {cartItems.map((item) => {
                const effectivePrice = item.product.discountPrice || item.product.price;
                const isOutOfStock = item.product.stock === 0;
                const quantityWarning = item.quantity > item.product.stock;

                return (
                  <div key={item.id} className={`flex flex-col md:flex-row gap-6 p-6 border-b border-outline-variant/30 ${isOutOfStock ? 'opacity-70' : 'hover:bg-surface-container-lowest transition-colors'}`}>
                    {/* Product Image */}
                    <Link to={`/product/${item.product.sku}`} className="shrink-0 group relative overflow-hidden">
                      <div className="w-full md:w-[150px] aspect-[3/4] overflow-hidden rounded bg-surface-container-low">
                        {getProductImage(item.product, 'fullBody') ? (
                          <img
                            src={getProductImage(item.product, 'fullBody')}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-outline-variant">
                            <span className="material-symbols-outlined text-5xl">image</span>
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-surface/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <span className="font-label-caps text-label-caps text-error bg-surface px-3 py-1">OUT OF STOCK</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="flex-grow flex flex-col justify-between h-full w-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Link to={`/product/${item.product.sku}`} className="hover:text-secondary transition-colors">
                            <h3 className="font-story-serif text-[18px] md:text-[20px] text-on-surface mb-2">{item.product.name}</h3>
                          </Link>
                          <div className="flex flex-col gap-1 mt-2">
                            {item.product.sku && (
                              <p className="font-label-caps text-label-caps text-on-surface-variant">
                                <span className="font-semibold">SKU:</span> {item.product.sku}
                              </p>
                            )}
                            {item.product.weight && (
                              <p className="font-label-caps text-label-caps text-on-surface-variant">
                                <span className="font-semibold">Weight:</span> {item.product.weight} g
                              </p>
                            )}
                            {item.product.primaryColor && (
                              <p className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
                                <span className="font-semibold">Color:</span>
                                <span 
                                  className="w-3 h-3 rounded-full inline-block border border-outline-variant/30"
                                  style={{ backgroundColor: item.product.primaryColor.replace(/\s+/g, '').toLowerCase() }}
                                  title={item.product.primaryColor}
                                ></span>
                                {item.product.primaryColor}
                              </p>
                            )}
                            {item.product.weaveType && (
                              <p className="font-label-caps text-label-caps text-on-surface-variant">
                                <span className="font-semibold">Weave Type:</span> {item.product.weaveType}
                              </p>
                            )}
                            {item.addedToCartAt && (
                              <p className="font-body-md text-[11px] text-on-surface-variant mt-2 italic opacity-70">
                                Added on: {formatAddedDate(item.addedToCartAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4 flex flex-col items-end gap-1">
                          <span className="font-body-lg text-[16px] text-primary block">Unit: ₹{effectivePrice.toLocaleString()}</span>
                          {item.product.discountPrice && (
                            <span className="font-body-md text-xs text-on-surface-variant line-through">₹{item.product.price.toLocaleString()}</span>
                          )}
                          <span className="font-body-md text-xs text-on-surface-variant mt-2">Line Total: ₹{(effectivePrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="font-body-md text-xs text-on-surface-variant">GST ({item.product.gstPercent || 0}%): ₹{((effectivePrice * item.quantity * (item.product.gstPercent || 0)) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="font-body-md text-[14px] font-bold text-primary mt-1">Final: ₹{((effectivePrice * item.quantity) * (1 + (item.product.gstPercent || 0) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      
                      {quantityWarning && !isOutOfStock && (
                        <p className="font-body-md text-sm text-error mb-2">Only {item.product.stock} items available</p>
                      )}

                      <div className="flex justify-between items-end mt-auto pt-6">
                        <div className={`flex items-center border-b pb-1 ${isOutOfStock ? 'border-outline-variant opacity-50 pointer-events-none' : 'border-primary'}`}>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-primary hover:text-primary-container px-2 cursor-pointer disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                          </button>
                          <span className="font-body-md text-body-md px-4">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-primary hover:text-primary-container px-2 cursor-pointer disabled:opacity-50"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                        
                        <div className="flex gap-4 items-center">
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.product.name)}
                            className="text-error hover:text-error/80 transition-colors flex items-center gap-1 font-label-caps text-label-caps"
                          >
                            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-4">
              <div className="bg-surface-container-low p-8 motif-border sticky top-[100px]">
                <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b border-outline-variant/50 pb-4">Order Summary</h2>
                <div className="flex flex-col gap-4 mb-8 border-b border-outline-variant/50 pb-6">
                  <div className="flex justify-between font-body-md text-body-md text-on-surface">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-surface">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-surface">
                    <span>Estimated Tax (GST)</span>
                    <span>₹{estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="flex justify-between font-story-serif text-story-serif text-primary mb-8 font-semibold">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="mb-8">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="coupon">GIFT CARD OR DISCOUNT CODE</label>
                  <div className="flex gap-2">
                    <input 
                      className="flex-grow bg-transparent border-0 border-b border-primary focus:ring-0 focus:border-b-2 px-0 py-2 font-body-md text-body-md placeholder-outline disabled:opacity-50" 
                      id="coupon" 
                      placeholder="Enter code" 
                      type="text" 
                      disabled={hasOutOfStockItems}
                    />
                    <button 
                      className="px-4 py-2 font-label-caps text-label-caps text-primary border border-primary hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={hasOutOfStockItems}
                    >
                      APPLY
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  disabled={hasOutOfStockItems}
                  className="w-full bg-primary-container text-[#FFD700] hover:bg-primary transition-colors py-4 font-label-caps text-label-caps tracking-widest flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-container"
                >
                  {hasOutOfStockItems ? 'UPDATE BAG TO CHECKOUT' : 'PROCEED TO CHECKOUT'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <p className="text-center font-label-caps text-label-caps text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/30 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">lock</span> Secure Checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default ShoppingBag;

