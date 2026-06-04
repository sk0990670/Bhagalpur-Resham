import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../app/store';
import {
  setWishlistItems,
  addWishlistItem,
  removeWishlistItem,
} from './wishlistSlice';
import { wishlistService } from '../../shared/services/wishlist.service';

interface UseWishlistReturn {
  wishlistItems: string[];
  isInWishlist: (productId: string) => boolean;
  toggleItem: (productId: string, productName?: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

export const useWishlist = (
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void
): UseWishlistReturn => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // A valid token is a real JWT (3 segments) — not a dummy string
  const hasValidToken = Boolean(token && token.split('.').length === 3);

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.includes(productId),
    [wishlistItems]
  );

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !hasValidToken) return;
    try {
      const res = await wishlistService.getWishlist();
      // Backend: { data: { items: [{ product: {...}, addedAt }] } }
      const rawItems = res.data?.items || res.items || [];
      const ids = rawItems.map((item: any) => {
        const prod = item.product || item;
        return typeof prod === 'string' ? prod : prod._id;
      }).filter(Boolean);
      dispatch(setWishlistItems(ids));
    } catch (err) {
      // Silently ignore — interceptor handles 401
      console.error('Wishlist fetch error:', err);
    }
  }, [isAuthenticated, hasValidToken, dispatch]);

  const toggleItem = useCallback(
    async (productId: string, productName = 'Saree') => {
      // Guard: not logged in or no valid token → redirect to login
      if (!isAuthenticated || !hasValidToken) {
        navigate('/login', {
          state: {
            from: location,
            wishlistAction: { productId },
            message: 'Please login to save your favorite sarees.',
          },
        });
        return;
      }

      const wasInWishlist = wishlistItems.includes(productId);

      // Optimistic update immediately (feels instant like Flipkart)
      if (wasInWishlist) {
        dispatch(removeWishlistItem(productId));
      } else {
        dispatch(addWishlistItem(productId));
      }

      try {
        if (wasInWishlist) {
          await wishlistService.removeItem(productId);
          showToast?.(`${productName} removed from wishlist.`, 'info');
        } else {
          await wishlistService.addItem({ productId });
          showToast?.('Added to your wishlist.', 'success');
        }
      } catch (err: any) {
        // Roll back optimistic update on failure
        if (wasInWishlist) {
          dispatch(addWishlistItem(productId));
        } else {
          dispatch(removeWishlistItem(productId));
        }
        const apiMsg = err?.response?.data?.message;
        // Don't show toast for auth errors (interceptor handles them)
        if (err?.response?.status !== 401) {
          showToast?.(apiMsg || 'Something went wrong. Please try again.', 'error');
        }
      }
    },
    [isAuthenticated, hasValidToken, wishlistItems, dispatch, navigate, location, showToast]
  );

  return { wishlistItems, isInWishlist, toggleItem, fetchWishlist };
};
