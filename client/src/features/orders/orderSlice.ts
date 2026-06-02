import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
  currentOrder: any | null;
  history: any[];
}

const initialState: OrderState = {
  currentOrder: null,
  history: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder(state, action: PayloadAction<any>) {
      state.currentOrder = action.payload;
    },
    setOrderHistory(state, action: PayloadAction<any[]>) {
      state.history = action.payload;
    }
  },
});

export const { setCurrentOrder, setOrderHistory } = orderSlice.actions;
export default orderSlice.reducer;
