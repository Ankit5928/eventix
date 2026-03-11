import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reservationService from "../../service/reservationService";
import { ReservationSummaryDTO } from "../../types/reservation.types";

interface ReservationState {
  summary: ReservationSummaryDTO | null;
  isExpired: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  summary: null,
  isExpired: false,
  isLoading: false,
  error: null,
};

export const fetchReservationSummary = createAsyncThunk(
  "reservation/fetchSummary",
  async (id: string, { rejectWithValue }) => {
    try {
      return await reservationService.getSummary(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Reservation not found");
    }
  },
);

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setExpired: (state) => {
      state.isExpired = true;
      state.summary = null;
    },
    resetReservation: (state) => {
      state.isExpired = false;
      state.summary = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservationSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReservationSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchReservationSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setExpired, resetReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
