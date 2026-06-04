import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import Preloader from './shared/components/Preloader';
import { RootState } from './app/store';
import { setWishlistItems } from './features/wishlist/wishlistSlice';
import { wishlistService } from './shared/services/wishlist.service';
import { setCart } from './features/cart/cartSlice';
import { cartService } from './shared/services/cart.service';

// CartSync runs inside BrowserRouter so react-router hooks work
function CartSync() {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const hasValidToken = Boolean(token && token.split('.').length === 3);

  useEffect(() => {
    if (!isAuthenticated || !hasValidToken) {
      dispatch(setCart({ items: [], subtotal: 0, totalItems: 0 }));
      return;
    }

    cartService
      .syncCart([])
      .then((res) => {
        if (res.data) {
          dispatch(setCart({
            items: res.data.items || [],
            subtotal: res.data.subtotal || 0,
            totalItems: res.data.totalItems || 0,
          }));
        }
      })
      .catch(() => {
        // Silently ignore — api interceptor handles 401
      });
  }, [isAuthenticated, hasValidToken, dispatch]);

  return null;
}

// WishlistSync runs inside BrowserRouter so react-router hooks work
function WishlistSync() {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // A real JWT has exactly 3 dot-separated segments
  const hasValidToken = Boolean(token && token.split('.').length === 3);

  useEffect(() => {
    if (!isAuthenticated || !hasValidToken) {
      dispatch(setWishlistItems([]));
      return;
    }

    wishlistService
      .getWishlist()
      .then((res) => {
        const rawItems = res.data?.items || res.items || [];
        const ids = rawItems
          .map((item: any) => {
            const prod = item.product || item;
            return typeof prod === 'string' ? prod : prod._id;
          })
          .filter(Boolean);
        dispatch(setWishlistItems(ids));
      })
      .catch(() => {
        // Silently ignore — api interceptor handles 401 (token refresh / logout)
      });
  }, [isAuthenticated, hasValidToken, dispatch]);

  return null;
}

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      <BrowserRouter>
        <CartSync />
        <WishlistSync />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
