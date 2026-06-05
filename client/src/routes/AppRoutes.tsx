import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../shared/layouts/MainLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute';

// Auth & User
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import CustomerDashboardPage from '../features/auth/pages/CustomerDashboardPage';
import ArtisanCreditsPage from '../features/auth/pages/ArtisanCreditsPage';

// Products
import HomePage from '../features/products/pages/HomePage';
import CollectionsPage from '../features/products/pages/CollectionsPage';
import ProductDetailPage from '../features/products/pages/ProductDetailPage';
import ProductSearchPage from '../features/products/pages/ProductSearchPage';

// Cart & Checkout
import ShoppingBagPage from '../features/cart/pages/ShoppingBagPage';
import CheckoutPage from '../features/checkout/pages/CheckoutPage';

// Orders
import OrderConfirmationPage from '../features/orders/pages/OrderConfirmationPage';
import OrderHistoryPage from '../features/orders/pages/OrderHistoryPage';
import OrderTrackingPage from '../features/orders/pages/OrderTrackingPage';

// Support
import CustomerSupportPage from '../features/support/pages/CustomerSupportPage';

// Wishlist
import WishlistPage from '../features/wishlist/pages/WishlistPage';

// CMS
import ArtisanStoryPage from '../features/cms/pages/ArtisanStoryPage';
import ContactUsPage from '../features/cms/pages/ContactUsPage';
import FAQPage from '../features/cms/pages/FAQPage';
import HeritagePage from '../features/cms/pages/HeritagePage';
import HistoryOfTussarPage from '../features/cms/pages/HistoryOfTussarPage';
import MithilaArtistryPage from '../features/cms/pages/MithilaArtistryPage';
import ReturnPolicyPage from '../features/cms/pages/ReturnPolicyPage';
import ShippingPolicyPage from '../features/cms/pages/ShippingPolicyPage';
import SilkMarkPage from '../features/cms/pages/SilkMarkPage';
import StoryPage from '../features/cms/pages/StoryPage';
import PrivacyPolicyPage from '../features/cms/pages/PrivacyPolicyPage';

// Admin
import AdminLoginPage from '../features/admin/pages/AdminLoginPage';
import DashboardPage from '../features/admin/pages/DashboardPage';
import ProductManagementPage from '../features/admin/pages/ProductManagementPage';
import SareeCreationPage from '../features/admin/pages/SareeCreationPage';
import OrdersManagementPage from '../features/admin/pages/OrdersManagementPage';
import CustomerManagementPage from '../features/admin/pages/CustomerManagementPage';
import CouponManagementPage from '../features/admin/pages/CouponManagementPage';
import ReviewModerationPage from '../features/admin/pages/ReviewModerationPage';
import AnalyticsPage from '../features/admin/pages/AnalyticsPage';
import ContentManagementPage from '../features/admin/pages/ContentManagementPage';
import ArtisanNetworkPage from '../features/admin/pages/ArtisanNetworkPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="product/:sku" element={<ProductDetailPage />} />
        <Route path="artisans" element={<ArtisanStoryPage />} />
        <Route path="cart" element={<ShoppingBagPage />} />
        
        {/* Protected Customer Routes (Wrapped) */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="order-history" element={<OrderHistoryPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="track-order" element={<Navigate to="/order-history" replace />} />
          <Route path="track-order/:orderId" element={<OrderTrackingPage />} />
          <Route path="support" element={<CustomerSupportPage />} />
          <Route path="artisan-credits" element={<ArtisanCreditsPage />} />
        </Route>

        {/* Public Auth Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Public CMS Routes */}
        <Route path="contact" element={<ContactUsPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="returns" element={<ReturnPolicyPage />} />
        <Route path="shipping" element={<ShippingPolicyPage />} />
        <Route path="search" element={<ProductSearchPage />} />
        <Route path="heritage" element={<HeritagePage />} />
        <Route path="history-of-tussar" element={<HistoryOfTussarPage />} />
        <Route path="mithila-artistry" element={<MithilaArtistryPage />} />
        <Route path="silk-mark" element={<SilkMarkPage />} />
        <Route path="story" element={<StoryPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
      </Route>
      
      {/* Admin Routes (Without Main Layout for now until AdminLayout is extracted) */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      
      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/inventory" element={<ProductManagementPage />} />
        <Route path="/admin/inventory/new" element={<SareeCreationPage />} />
        <Route path="/admin/inventory/edit/:id" element={<SareeCreationPage />} />
        <Route path="/admin/orders" element={<OrdersManagementPage />} />
        <Route path="/admin/customers" element={<CustomerManagementPage />} />
        <Route path="/admin/coupons" element={<CouponManagementPage />} />
        <Route path="/admin/reviews" element={<ReviewModerationPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/content" element={<ContentManagementPage />} />
        <Route path="/admin/artisans" element={<ArtisanNetworkPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
