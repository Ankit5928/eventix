import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentIntentService from "../../service/paymentIntentService";
import { PaymentIntentState } from "../../types/payment-intent.types";

const initialState: PaymentIntentState = {
  clientSecret: null,
  status: "idle",
  error: null,
};

export const initiatePayment = createAsyncThunk(
  "paymentIntent/create",
  async (reservationId: string, { rejectWithValue }) => {
    try {
      return await paymentIntentService.createIntent({ reservationId });
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to initiate payment",
      );
    }
  },
);

const paymentIntentSlice = createSlice({
  name: "paymentIntent",
  initialState,
  reducers: {
    resetPaymentStatus: (state) => {
      state.status = "idle";
      state.clientSecret = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetPaymentStatus } = paymentIntentSlice.actions;
export default paymentIntentSlice.reducer;
