import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../service/orderService';
import { OrderResponse } from '../../types/order.types';

interface OrderState {
  currentOrder: OrderResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchDetails',
  async (orderId: string, thunkAPI) => {
    try {
      return await orderService.getOrderDetails(orderId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to load order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;