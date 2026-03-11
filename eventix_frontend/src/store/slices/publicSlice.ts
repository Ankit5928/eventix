import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import publicService from "../../service/publicService";
import {
  PublicEventDTO,
  ReservationRequest,
  ReservationResponse,
} from "../../types/public.types";

interface PublicState {
  events: PublicEventDTO[];
  activeReservation: ReservationResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PublicState = {
  events: [],
  activeReservation: null,
  isLoading: false,
  error: null,
};

export const makeReservation = createAsyncThunk(
  "public/reserve",
  async (
    { eventId, request }: { eventId: number; request: ReservationRequest },
    { rejectWithValue },
  ) => {
    try {
      return await publicService.createReservation(eventId, request);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Inventory no longer available",
      );
    }
  },
);

const publicSlice = createSlice({
  name: "public",
  initialState,
  reducers: {
    clearReservation: (state) => {
      state.activeReservation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(makeReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeReservation = action.payload;
      })
      .addCase(makeReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReservation } = publicSlice.actions;
export default publicSlice.reducer;
