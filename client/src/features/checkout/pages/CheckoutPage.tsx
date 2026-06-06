import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductImage } from '../../../shared/utils/imageHelper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { setCart } from '../../cart/cartSlice';
import api from '../../../shared/services/api';
import { useToast } from '../../../shared/hooks/useToast';
import { ToastContainer } from '../../../shared/components/Toast';
import { validateEmail, validateMobile, validatePincode, validateCity, validateFullName, validateAddressLine1, fetchLocationByPincode } from '../../../shared/utils/validation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast, removeToast, toasts } = useToast();

  const { items: cartItems, subtotal } = useSelector((state: RootState) => state.cart);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    locality: '',
    landmark: ''
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    phone: '',
    fullName: '',
    address1: '',
    city: '',
    zip: '',
    locality: ''
  });

  const [isPincodeFetching, setIsPincodeFetching] = useState(false);
  const [isCityLocked, setIsCityLocked] = useState(false);
  const [localities, setLocalities] = useState<string[]>([]);
  const [isLocalityDropdownOpen, setIsLocalityDropdownOpen] = useState(false);
  const [localitySearch, setLocalitySearch] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'paylater' | 'emi' | 'cod'>('upi');
  
  const [pricing, setPricing] = useState({
    shipping: 0,
    tax: 0,
    total: 0,
    codAmount: 0,
    creditDiscount: 0
  });

  const [availableCredits, setAvailableCredits] = useState(0);
  const [creditsInput, setCreditsInput] = useState('');
  const [appliedCredits, setAppliedCredits] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/credits/balance')
        .then(res => setAvailableCredits(res.data?.data?.availableCredits || 0))
        .catch(err => console.error('Failed to fetch credits balance', err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchPricing = async () => {
      if (cartItems.length === 0) return;
      try {
        const payload = {
          items: cartItems.map((i) => ({ product: i.product.id, qty: i.quantity })),
          shippingAddress: { pincode: formData.zip },
          paymentMethod,
          creditsToRedeem: appliedCredits > 0 ? appliedCredits : undefined
        };
        const res = await api.post('/orders/calculate-pricing', payload);
        if (res.data?.data) {
          setPricing({
            shipping: res.data.data.shipping,
            tax: res.data.data.tax,
            total: res.data.data.total,
            codAmount: res.data.data.codAmount || 0,
            creditDiscount: res.data.data.creditDiscount || 0
          });
        }
      } catch (e) {
        console.error('Failed to fetch pricing', e);
      }
    };
    
    // Fetch pricing if PIN is 6 digits or empty
    if (formData.zip.length === 6 || formData.zip.length === 0) {
      fetchPricing();
    }
  }, [cartItems, formData.zip, paymentMethod, appliedCredits]);

  const handleApplyCredits = async () => {
    const amountToRedeem = Number(creditsInput);
    if (isNaN(amountToRedeem) || amountToRedeem < 100) {
      showToast('Minimum redemption is 100 credits.', 'error');
      return;
    }
    if (!Number.isInteger(amountToRedeem)) {
      showToast('Credits must be a whole number.', 'error');
      return;
    }
    const maxAllowed = Math.floor((subtotal) * 0.20);
    if (amountToRedeem > maxAllowed) {
      showToast(`Maximum allowed redemption is ${maxAllowed} credits.`, 'error');
      return;
    }
    if (amountToRedeem > availableCredits) {
      showToast('Insufficient credits balance.', 'error');
      return;
    }
    
    try {
      await api.post('/credits/validate-redemption', { creditsToRedeem: amountToRedeem, orderTotal: subtotal });
      setAppliedCredits(amountToRedeem);
      showToast(`Successfully applied ${amountToRedeem} credits.`, 'success');
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Failed to apply credits', 'error');
    }
  };

  const handleRemoveCredits = () => {
    setAppliedCredits(0);
    setCreditsInput('');
    showToast('Credits removed.', 'success');
  };

  const [hasPlacedOrder, setHasPlacedOrder] = useState(false);

  useEffect(() => {
    // Empty Cart Protection
    if (cartItems.length === 0 && !hasPlacedOrder) {
      navigate('/cart');
    }
  }, [cartItems, navigate, hasPlacedOrder]);

  useEffect(() => {
    // Pre-fill user details if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        fullName: user.name || prev.fullName,
        phone: (user as any).phone || prev.phone // In case phone is on user object
      }));
    }
  }, [user]);

  // Calculations are now handled by the backend and stored in `pricing` state.

  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validateMobile(value);
        break;
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'address1':
        error = validateAddressLine1(value);
        break;
      case 'city':
        error = validateCity(value);
        break;
      case 'zip':
        error = validatePincode(value);
        break;
      case 'locality':
        if (!value) error = 'Please select a locality.';
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error while typing, or validate in real-time
    if (formErrors[id as keyof typeof formErrors]) {
      validateField(id, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    validateField(id, value);
  };

  // Pincode Auto-fill Logic
  useEffect(() => {
    const fetchPincode = async () => {
      if (formData.zip.length === 6) {
        const error = validatePincode(formData.zip);
        if (!error) {
          setIsPincodeFetching(true);
          const location = await fetchLocationByPincode(formData.zip);
          setIsPincodeFetching(false);
          
          if (location) {
            setFormData(prev => ({
              ...prev,
              city: location.city,
              state: location.state,
              locality: ''
            }));
            setLocalities(location.localities);
            setFormErrors(prev => ({ ...prev, city: '', zip: '', locality: '' }));
            setIsCityLocked(true); // Lock the fields since they are fetched reliably
          } else {
            setFormErrors(prev => ({ ...prev, zip: 'Invalid PIN code.' }));
            setLocalities([]);
            setFormData(prev => ({ ...prev, locality: '' }));
            setIsCityLocked(false);
          }
        }
      } else {
        setIsCityLocked(false);
        setLocalities([]);
      }
    };

    fetchPincode();
  }, [formData.zip]);

  const isFormValid = () => {
    const errors = {
      email: validateEmail(formData.email),
      phone: validateMobile(formData.phone),
      fullName: validateFullName(formData.fullName),
      address1: validateAddressLine1(formData.address1),
      city: validateCity(formData.city),
      zip: validatePincode(formData.zip),
      locality: formData.locality ? '' : 'Please select a locality.'
    };
    
    setFormErrors(errors);
    return Object.values(errors).every(err => err === '');
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' }, message: 'Please login to continue checkout.' } });
      return;
    }

    if (!isFormValid()) {
      showToast('Please fix the validation errors in the form.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        items: cartItems.map((i) => ({ product: i.product.id, qty: i.quantity })),
        shippingAddress: {
          name: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.address1,
          addressLine2: formData.address2,
          city: formData.city,
          state: formData.state,
          pincode: formData.zip,
          locality: formData.locality
        },
        paymentMethod,
        creditsToRedeem: appliedCredits > 0 ? appliedCredits : undefined
      };

      const requiresOnlinePayment = paymentMethod !== 'cod' || (paymentMethod === 'cod' && pricing.shipping > 0);
      const searchParams = new URLSearchParams(window.location.search);
      const retryOrderId = searchParams.get('retryOrderId');
      if (retryOrderId) {
        payload.retryOrderId = retryOrderId;
      }

      // 1. INITIATE ORDER (Creates PENDING order in DB)
      const res = await api.post('/orders', payload);
      const order = res.data.data.order;
      const razorpayData = res.data.data.razorpay;

      if (!requiresOnlinePayment || !razorpayData) {
        // Free COD order, automatically confirmed
        setHasPlacedOrder(true);
        dispatch(setCart({ items: [], totalItems: 0, subtotal: 0 }));
        navigate('/order-confirmation', { 
          state: { 
            orderId: order._id, 
            estimatedDelivery: order.estimatedDelivery,
            shippingPaid: paymentMethod === 'cod' ? pricing.shipping : undefined,
            codAmount: paymentMethod === 'cod' ? pricing.codAmount : undefined
          } 
        });
      } else {
        // ONLINE PAYMENT FLOW
        const { razorpayOrderId, amount, currency, keyId } = razorpayData;
        const razorpayKey = (import.meta.env.VITE_RAZORPAY_KEY_ID && import.meta.env.VITE_RAZORPAY_KEY_ID !== 'undefined') 
          ? import.meta.env.VITE_RAZORPAY_KEY_ID 
          : keyId;

        if (!window.Razorpay) {
          showToast('Payment gateway failed to load. Please disable any adblockers and refresh the page.', 'error');
          setIsSubmitting(false);
          return;
        }

        console.log('[Razorpay] Init Order Success:', razorpayData);
        
        const options = {
          key: razorpayKey,
          amount,
          currency,
          name: 'Bhagalpur Resham',
          description: 'Acquisition of Heritage Handloom',
          image: `${window.location.origin}/favicon.png`,
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              setIsSubmitting(true);
              const verifyPayload = {
                orderId: order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              };
              console.log('[Razorpay] Payment Success Callback Triggered:', response);
              
              // 2. VERIFY PAYMENT (Sets to CONFIRMED, clears cart)
              const verifyRes = await api.post('/payments/verify', verifyPayload);
              console.log('[Razorpay] Backend Verification Response:', verifyRes.data);
              
              if (verifyRes.data) {
                setHasPlacedOrder(true);
                dispatch(setCart({ items: [], totalItems: 0, subtotal: 0 }));
                navigate('/order-confirmation', { 
                  state: { 
                    orderId: order._id, 
                    estimatedDelivery: order.estimatedDelivery,
                    shippingPaid: paymentMethod === 'cod' ? pricing.shipping : undefined,
                    codAmount: paymentMethod === 'cod' ? pricing.codAmount : undefined
                  } 
                });
              }
            } catch (err: any) {
              console.error('[Razorpay] Backend Verification Failed:', err.response?.data || err);
              showToast(err.response?.data?.message || 'Payment verification failed. Please try again.', 'error');
              setIsSubmitting(false);
              // Do not navigate, let them stay on checkout or go to history to retry
            }
          },
          modal: {
            ondismiss: function () {
              console.log('[Razorpay] Checkout modal closed by user');
              setIsSubmitting(false);
              // Redirect to order history so they can retry payment later
              navigate('/order-history');
              showToast('Payment cancelled. Your order is pending payment.', 'info');
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
            method: paymentMethod === 'cod' ? 'upi' : paymentMethod
          },
          theme: {
            color: '#800020'
          }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response: any) {
          console.error('[Razorpay] Payment Failed Event:', response.error);
          showToast(`Payment Failed: ${response.error.description}`, 'error');
          setIsSubmitting(false);
        });
        
        rzp.open();
      }
    } catch (error: any) {
      console.error('[Checkout Error]:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to initialize order.';
      const errors = error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : '';
      showToast(`${msg} ${errors}`.trim(), 'error');
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (error: string, value: string) => {
    let base = "input-line font-body-md text-body-md text-on-surface focus:ring-0 w-full transition-colors";
    if (error) {
      return `${base} border-red-500 focus:border-red-500 text-red-500`;
    }
    if (value && !error) {
      return `${base} border-green-500 focus:border-green-500`;
    }
    return base;
  };

  const isFormHasErrors = Object.values(formErrors).some(err => err !== '');
  const isFormIncomplete = !formData.email || !formData.phone || !formData.fullName || !formData.address1 || !formData.city || !formData.zip || !formData.locality;

  return (
    <>
      <main className="flex-grow pt-16 md:pt-[100px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Secure Checkout</h1>
          <p className="font-story-serif text-story-serif text-on-surface-variant italic">Complete your acquisition of handcrafted heritage.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-12">
            {/* Contact Info */}
            <section>
              <h2 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">contact_mail</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="email">Email Address *</label>
                  <input value={formData.email} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.email, formData.email)} id="email" placeholder="your@email.com" type="email" />
                  {formErrors.email && <span className="text-red-500 text-xs mt-1">{formErrors.email}</span>}
                </div>
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="phone">Phone Number *</label>
                  <input value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.phone, formData.phone)} id="phone" placeholder="10-digit mobile number" type="tel" />
                  {formErrors.phone && <span className="text-red-500 text-xs mt-1">{formErrors.phone}</span>}
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section>
              <h2 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">local_shipping</span>
                Delivery Address
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="fullName">Full Name *</label>
                  <input value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.fullName, formData.fullName)} id="fullName" placeholder="As it appears on your ID" type="text" />
                  {formErrors.fullName && <span className="text-red-500 text-xs mt-1">{formErrors.fullName}</span>}
                </div>
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="address1">Address Line 1 *</label>
                  <input value={formData.address1} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.address1, formData.address1)} id="address1" placeholder="House/Flat No., Building Name" type="text" />
                  {formErrors.address1 && <span className="text-red-500 text-xs mt-1">{formErrors.address1}</span>}
                </div>
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="address2">Address Line 2 (Optional)</label>
                  <input value={formData.address2} onChange={handleInputChange} className="input-line font-body-md text-body-md text-on-surface focus:ring-0 w-full transition-colors" id="address2" placeholder="Street, Locality" type="text" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="zip">ZIP / Postal Code *</label>
                    <div className="relative">
                      <input value={formData.zip} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.zip, formData.zip)} id="zip" placeholder="6-digit PIN" type="text" maxLength={6} />
                      {isPincodeFetching && <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-primary material-symbols-outlined animate-spin">refresh</span>}
                    </div>
                    {formErrors.zip && <span className="text-red-500 text-xs mt-1">{formErrors.zip}</span>}
                  </div>
                  <div className="flex flex-col relative">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="locality">Area / Locality *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={isLocalityDropdownOpen ? localitySearch : formData.locality}
                        onChange={(e) => {
                          if (isLocalityDropdownOpen) {
                            setLocalitySearch(e.target.value);
                          } else {
                            setIsLocalityDropdownOpen(true);
                            setLocalitySearch(e.target.value);
                          }
                        }}
                        onFocus={() => {
                          if (localities.length > 0) {
                            setIsLocalityDropdownOpen(true);
                            setLocalitySearch('');
                          }
                        }}
                        onBlur={() => {
                          // Slight delay to allow click on dropdown items
                          setTimeout(() => {
                            setIsLocalityDropdownOpen(false);
                            validateField('locality', formData.locality);
                          }, 200);
                        }}
                        placeholder="Select Locality"
                        disabled={localities.length === 0}
                        className={`${getInputStyle(formErrors.locality, formData.locality)} bg-transparent cursor-pointer`}
                        readOnly={!isLocalityDropdownOpen && localities.length > 0}
                      />
                      <span className="material-symbols-outlined absolute right-2 top-1/2 transform -translate-y-1/2 text-on-surface-variant pointer-events-none transition-transform duration-300" style={{ transform: isLocalityDropdownOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)' }}>
                        expand_more
                      </span>
                    </div>

                    {isLocalityDropdownOpen && localities.length > 0 && (
                      <div className="absolute z-20 top-[calc(100%+4px)] left-0 w-full max-h-60 overflow-y-auto bg-surface-container-lowest border border-outline-variant/50 shadow-lg rounded-sm custom-scrollbar">
                        {localities.filter(l => l.toLowerCase().includes(localitySearch.toLowerCase())).length > 0 ? (
                          localities.filter(l => l.toLowerCase().includes(localitySearch.toLowerCase())).map(loc => (
                            <div
                              key={loc}
                              className="px-4 py-3 hover:bg-surface-variant cursor-pointer text-on-surface font-body-md transition-colors"
                              onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input blur before click fires
                                setFormData(prev => ({ ...prev, locality: loc }));
                                setFormErrors(prev => ({ ...prev, locality: '' }));
                                setIsLocalityDropdownOpen(false);
                              }}
                            >
                              {loc}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-on-surface-variant font-body-md text-sm italic">
                            No matching localities found.
                          </div>
                        )}
                      </div>
                    )}
                    {formErrors.locality && <span className="text-red-500 text-xs mt-1">{formErrors.locality}</span>}
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="city">City *</label>
                    <input value={formData.city} onChange={handleInputChange} onBlur={handleBlur} className={getInputStyle(formErrors.city, formData.city)} id="city" placeholder="City" type="text" disabled={isCityLocked} />
                    {formErrors.city && <span className="text-red-500 text-xs mt-1">{formErrors.city}</span>}
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="state">State *</label>
                    <input value={formData.state} onChange={handleInputChange} className="input-line font-body-md text-body-md text-on-surface focus:ring-0 w-full transition-colors" id="state" placeholder="State" type="text" disabled={isCityLocked} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1" htmlFor="landmark">Landmark (Optional)</label>
                  <input value={formData.landmark} onChange={handleInputChange} className="input-line font-body-md text-body-md text-on-surface focus:ring-0 w-full transition-colors" id="landmark" placeholder="Near a known place" type="text" />
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section>
              <h2 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">inventory_2</span>
                Shipping Method
              </h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border cursor-default transition-colors border-primary bg-surface-container-low">
                  <span className="material-symbols-outlined text-tertiary">local_shipping</span>
                  <div className="ml-4 flex-grow flex justify-between items-center">
                    <div>
                      <span className="block font-body-md text-body-md font-semibold text-on-surface">Speed Post Delivery</span>
                      <span className="block font-body-md text-body-md text-on-surface-variant text-sm">Calculated using India Post tariff</span>
                    </div>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">
                      {pricing.shipping > 0 ? `₹${pricing.shipping.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                </label>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-outline-variant/50 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">payments</span>
                Payment Method
              </h2>
              <div className="space-y-4">
                {/* UPI */}
                <div className={`border ${paymentMethod === 'upi' ? 'border-primary' : 'border-outline-variant'}`}>
                  <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                    <div className="ml-4 flex-grow flex justify-between items-center">
                      <span className="block font-body-md text-body-md font-semibold text-on-surface">UPI / QR Code</span>
                    </div>
                  </label>
                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-surface-container-low border-t border-outline-variant">
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">Scan QR using any UPI app</p>
                    </div>
                  )}
                </div>
                {/* Card */}
                <div className={`border ${paymentMethod === 'card' ? 'border-primary' : 'border-outline-variant'}`}>
                  <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                    <div className="ml-4 flex-grow flex justify-between items-center">
                      <span className="block font-body-md text-body-md font-semibold text-on-surface">Credit / Debit Card</span>
                    </div>
                  </label>
                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-surface-container-low border-t border-outline-variant">
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">Pay securely using Credit or Debit Card</p>
                    </div>
                  )}
                </div>
                {/* Net Banking */}
                <div className={`border ${paymentMethod === 'netbanking' ? 'border-primary' : 'border-outline-variant'}`}>
                  <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                    <div className="ml-4 flex-grow flex justify-between items-center">
                      <span className="block font-body-md text-body-md font-semibold text-on-surface">Net Banking</span>
                    </div>
                  </label>
                  {paymentMethod === 'netbanking' && (
                    <div className="p-4 bg-surface-container-low border-t border-outline-variant">
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">Pay using your bank account</p>
                    </div>
                  )}
                </div>
                {/* EMI */}
                <div className={`border ${paymentMethod === 'emi' ? 'border-primary' : 'border-outline-variant'}`}>
                  <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input checked={paymentMethod === 'emi'} onChange={() => setPaymentMethod('emi')} className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                    <div className="ml-4 flex-grow flex justify-between items-center">
                      <span className="block font-body-md text-body-md font-semibold text-on-surface">EMI</span>
                    </div>
                  </label>
                  {paymentMethod === 'emi' && (
                    <div className="p-4 bg-surface-container-low border-t border-outline-variant">
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">Pay in easy monthly installments</p>
                    </div>
                  )}
                </div>
                {/* Pay Later */}
                <div className={`border ${paymentMethod === 'paylater' ? 'border-primary' : 'border-outline-variant'}`}>
                  <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input checked={paymentMethod === 'paylater'} onChange={() => setPaymentMethod('paylater')} className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                    <div className="ml-4 flex-grow flex justify-between items-center">
                      <span className="block font-body-md text-body-md font-semibold text-on-surface">Pay Later</span>
                    </div>
                  </label>
                  {paymentMethod === 'paylater' && (
                    <div className="p-4 bg-surface-container-low border-t border-outline-variant">
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">Buy now, pay later</p>
                    </div>
                  )}
                </div>
                {/* COD */}
                <div className={`border ${paymentMethod === 'cod' ? 'border-primary' : 'border-outline-variant'}`}>
                  <label className="flex items-center p-4 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <input checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-tertiary focus:ring-tertiary w-5 h-5 cursor-pointer" name="payment" type="radio" />
                    <span className="ml-4 font-body-md text-body-md font-semibold text-on-surface">Cash on Delivery</span>
                  </label>
                  {paymentMethod === 'cod' && pricing.shipping > 0 && (
                    <div className="p-4 bg-surface-container-low border-t border-outline-variant">
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm text-error">
                        * Note: Shipping fee (₹{pricing.shipping.toLocaleString()}) must be paid securely online now. The remaining balance (₹{pricing.codAmount.toLocaleString()}) will be paid on delivery. Shipping fees are non-refundable.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button disabled={isSubmitting || cartItems.length === 0 || isFormHasErrors || isFormIncomplete} onClick={handleSubmit} className="w-full bg-primary hover:bg-tertiary text-on-primary font-label-caps text-label-caps uppercase py-4 px-8 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Processing...' : (paymentMethod === 'cod' && pricing.shipping > 0 ? 'Pay Shipping & Complete Order' : 'Complete Secure Order')}
                <span className="material-symbols-outlined">lock</span>
              </button>
              <p className="text-center mt-4 font-body-md text-sm text-on-surface-variant">By placing your order, you agree to our Terms of Service & Privacy Policy.</p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 mithila-border shadow-[0_4px_20px_-4px_rgba(128,0,32,0.04)]">
              <h3 className="font-headline-md text-headline-md text-tertiary mb-6 border-b border-secondary/20 pb-4 text-center">Your Selection</h3>
              
              {/* Items */}
              <div className="space-y-6 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => {
                  const effectivePrice = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.id} className="flex gap-4 items-start">
                      <div className="w-24 h-32 flex-shrink-0 bg-surface-variant border border-secondary/30 relative overflow-hidden">
                        {getProductImage(item.product, 'fullBody') ? (
                          <div 
                            className="absolute inset-0 bg-cover bg-center" 
                            style={{ backgroundImage: `url('${getProductImage(item.product, 'fullBody')}')` }}
                          ></div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-outline-variant">
                            <span className="material-symbols-outlined text-4xl">image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-headline-md text-lg text-on-surface leading-tight mb-1">{item.product.name}</h4>
                        <p className="font-body-md text-sm text-on-surface-variant mb-2">SKU: {item.product.sku}</p>
                        {item.product.gstPercent && (
                          <p className="font-body-md text-xs text-on-surface-variant mb-2">GST: {item.product.gstPercent}%</p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-body-md text-body-md">Qty: {item.quantity}</span>
                          <span className="font-body-md text-body-md font-semibold">₹{(effectivePrice * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>


              {/* Apply Credits Section */}
              {availableCredits >= 100 && (
                <div className="bg-surface-container-lowest p-6 border-t border-secondary/20 mt-4">
                  <h4 className="font-headline-sm text-primary mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined">stars</span> Artisan Credits
                  </h4>
                  <p className="font-body-md text-sm text-on-surface-variant mb-4">
                    Balance: <strong>{availableCredits} credits</strong>
                  </p>
                  
                  {appliedCredits > 0 ? (
                    <div className="flex justify-between items-center bg-surface-container-low p-4 border border-secondary/30">
                      <div>
                        <p className="font-semibold text-secondary">{appliedCredits} Credits Applied</p>
                        <p className="text-xs text-on-surface-variant">Discount: ₹{appliedCredits}</p>
                      </div>
                      <button onClick={handleRemoveCredits} className="text-error text-sm font-bold hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={creditsInput} 
                          onChange={(e) => setCreditsInput(e.target.value)} 
                          placeholder="Enter Credits"
                          className="input-line flex-grow font-body-md text-sm"
                          min="100"
                        />
                        <button onClick={handleApplyCredits} className="bg-secondary text-on-secondary px-4 py-2 font-label-caps text-xs">Apply</button>
                      </div>
                      <button 
                        onClick={() => {
                          const maxAllowed = Math.floor(subtotal * 0.20);
                          setCreditsInput(Math.min(availableCredits, maxAllowed).toString());
                        }} 
                        className="text-secondary text-xs font-bold text-left hover:underline w-max"
                      >
                        Apply Max Allowed ({Math.min(availableCredits, Math.floor(subtotal * 0.20))})
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-on-surface-variant mt-2">100 credits = ₹100. Max 20% of subtotal.</p>
                </div>
              )}

              {/* Summary Totals */}
              <div className="bg-surface-container-low p-6 font-body-md text-on-surface border-t border-secondary/20 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                {pricing.tax > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-on-surface-variant">Estimated GST</span>
                    <span className="font-semibold">₹{pricing.tax.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    Speed Post Shipping
                  </span>
                  <span className="font-semibold">
                    {pricing.shipping > 0 ? `₹${pricing.shipping.toLocaleString()}` : 'Free'}
                  </span>
                </div>
                
                <div className="border-t border-outline-variant pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-headline-md text-xl text-tertiary">Grand Total</span>
                    <span className="font-headline-md text-xl text-tertiary font-bold">₹{pricing.total.toLocaleString()}</span>
                  </div>
                  
                  {paymentMethod === 'cod' && (
                    <div className="mt-4 pt-4 border-t border-outline-variant space-y-2">
                      <div className="flex justify-between items-center text-error">
                        <span className="font-body-md font-bold text-sm">Amount Payable Now (Shipping)</span>
                        <span className="font-body-md font-bold text-sm">₹{pricing.shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-primary">
                        <span className="font-body-md font-bold text-sm">Amount Payable on Delivery</span>
                        <span className="font-body-md font-bold text-sm">₹{pricing.codAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-outline-variant/30 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-secondary mb-1">verified</span>
                  <span className="text-[10px] font-label-caps uppercase text-on-surface-variant">Silk Mark Certified</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-secondary mb-1">handshake</span>
                  <span className="text-[10px] font-label-caps uppercase text-on-surface-variant">Authentic Handloom</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-secondary mb-1">shield_lock</span>
                  <span className="text-[10px] font-label-caps uppercase text-on-surface-variant">256-bit Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default Checkout;
