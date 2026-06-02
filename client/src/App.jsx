import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import ArtisanStory from './pages/ArtisanStory';
import ShoppingBag from './pages/ShoppingBag';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CustomerDashboard from './pages/CustomerDashboard';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import OrderTracking from './pages/OrderTracking';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import ProductSearch from './pages/ProductSearch';
import AdminLogin from './pages/AdminLogin';
import Heritage from './pages/Heritage';
import HistoryOfTussar from './pages/HistoryOfTussar';
import MithilaArtistry from './pages/MithilaArtistry';
import SilkMark from './pages/SilkMark';

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="collections" element={<Collections />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="artisans" element={<ArtisanStory />} />
            <Route path="cart" element={<ShoppingBag />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="order-tracking" element={<OrderTracking />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="returns" element={<ReturnPolicy />} />
            <Route path="shipping" element={<ShippingPolicy />} />
            <Route path="search" element={<ProductSearch />} />
            <Route path="heritage" element={<Heritage />} />
            <Route path="history-of-tussar" element={<HistoryOfTussar />} />
            <Route path="mithila-artistry" element={<MithilaArtistry />} />
            <Route path="silk-mark" element={<SilkMark />} />
          </Route>
          
          {/* Admin Routes (Without Main Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
