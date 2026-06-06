import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string; // cart item ID or product ID
  quantity: number;
  addedToCartAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    primaryColor?: string;
    weight?: number;
    weaveType?: string;
    price: number;
    discountPrice?: number;
    gstPercent: number;
    image: string;
    images?: { fullBody: string; closeup?: string; micro?: string };
    stock: number;
  };
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartState>) {
      state.items = action.payload.items || [];
      state.subtotal = action.payload.subtotal || 0;
      state.totalItems = action.payload.totalItems || 0;
    },
    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

