import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import paymentService from "../../service/paymentService";
import { PaymentState, StripeConfigRequest } from "../../types/payment.types";

const initialState: PaymentState = {
  publishableKey: null,
  isUpdating: false,
  error: null,
};

export const fetchPublishableKey = createAsyncThunk(
  "payment/fetchKey",
  async (orgId: number, { rejectWithValue }) => {
    try {
      return await paymentService.getPublishableKey(orgId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Stripe key",
      );
    }
  },
);

export const saveStripeConfig = createAsyncThunk(
  "payment/saveConfig",
  async (
    { orgId, data }: { orgId: number; data: StripeConfigRequest },
    { rejectWithValue },
  ) => {
    try {
      return await paymentService.updateStripeConfig(orgId, data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to update configuration",
      );
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchPublishableKey.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.publishableKey = action.payload;
        },
      )
      .addCase(saveStripeConfig.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(saveStripeConfig.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(saveStripeConfig.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
