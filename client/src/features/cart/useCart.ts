import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../app/store';
import { setCart } from './cartSlice';
import { cartService } from '../../shared/services/cart.service';

export const useCart = (
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const [isLoading, setIsLoading] = useState(false);

  const hasValidToken = Boolean(token && token.split('.').length === 3);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !hasValidToken) return;
    try {
      setIsLoading(true);
      const res = await cartService.getCart();
      if (res.data) {
        dispatch(setCart({
          items: res.data.items || [],
          subtotal: res.data.subtotal || 0,
          totalItems: res.data.totalItems || 0,
        }));
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasValidToken, dispatch]);

  const addToCart = useCallback(async (productId: string, qty: number = 1, productName: string = 'Item') => {
    if (!isAuthenticated || !hasValidToken) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please login to add items to your bag.',
        },
      });
      return false; // Indicate failure/redirect
    }

    try {
      setIsLoading(true);
      const res = await cartService.addItem({ productId, qty });
      if (res.data) {
        dispatch(setCart({
          items: res.data.items || [],
          subtotal: res.data.subtotal || 0,
          totalItems: res.data.totalItems || 0,
        }));
      }
      showToast?.(`Added ${productName} to your bag.`, 'success');
      return true; // Success
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      if (err?.response?.status !== 401) {
        showToast?.(apiMsg || 'Failed to add item. Please try again.', 'error');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasValidToken, dispatch, navigate, location, showToast]);

  const updateQuantity = useCallback(async (productId: string, qty: number) => {
    if (!isAuthenticated || !hasValidToken) return;
    
    try {
      setIsLoading(true);
      const res = await cartService.updateItem(productId, { qty });
      if (res.data) {
        dispatch(setCart({
          items: res.data.items || [],
          subtotal: res.data.subtotal || 0,
          totalItems: res.data.totalItems || 0,
        }));
      }
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      if (err?.response?.status !== 401) {
        showToast?.(apiMsg || 'Failed to update quantity.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasValidToken, dispatch, showToast]);

  const removeFromCart = useCallback(async (productId: string, productName: string = 'Item') => {
    if (!isAuthenticated || !hasValidToken) return;

    try {
      setIsLoading(true);
      const res = await cartService.removeItem(productId);
      if (res.data) {
        dispatch(setCart({
          items: res.data.items || [],
          subtotal: res.data.subtotal || 0,
          totalItems: res.data.totalItems || 0,
        }));
      }
      showToast?.(`Removed ${productName} from your bag.`, 'info');
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      if (err?.response?.status !== 401) {
        showToast?.(apiMsg || 'Failed to remove item.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasValidToken, dispatch, showToast]);

  return { cartItems, isLoading, fetchCart, addToCart, updateQuantity, removeFromCart };
};
