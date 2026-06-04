import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  items: string[]; // Array of product IDs
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Replace entire list (used after fetch from backend)
    setWishlistItems(state, action: PayloadAction<string[]>) {
      state.items = action.payload;
    },
    // Add a single item (optimistic)
    addWishlistItem(state, action: PayloadAction<string>) {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    // Remove a single item (optimistic)
    removeWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((id) => id !== action.payload);
    },
    // Legacy toggle (kept for backward compatibility)
    toggleWishlist(state, action: PayloadAction<string>) {
      const productId = action.payload;
      const index = state.items.indexOf(productId);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(productId);
      }
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const {
  setWishlistItems,
  addWishlistItem,
  removeWishlistItem,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
