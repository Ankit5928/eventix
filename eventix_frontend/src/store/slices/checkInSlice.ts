import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkInService from '../../service/checkInService';
import { CheckInStatsDTO, TicketValidationResponse } from '../../types/checkin.types';

interface CheckInState {
  stats: CheckInStatsDTO | null;
  scannedTicket: TicketValidationResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CheckInState = {
  stats: null,
  scannedTicket: null,
  isLoading: false,
  error: null,
};

export const fetchEventStats = createAsyncThunk(
  'checkin/fetchStats',
  async (eventId: number) => {
    return await checkInService.getEventStats(eventId);
  }
);

export const validateScannedCode = createAsyncThunk(
  'checkin/validate',
  async (code: string) => {
    return await checkInService.validateTicket(code);
  }
);

const checkInSlice = createSlice({
  name: 'checkin',
  initialState,
  reducers: {
    resetScanner: (state) => {
      state.scannedTicket = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(validateScannedCode.fulfilled, (state, action) => {
        state.scannedTicket = action.payload;
      })
      .addCase(validateScannedCode.rejected, (state, action) => {
        state.error = "Invalid QR Code or Network Error";
      });
  },
});

export const { resetScanner } = checkInSlice.actions;
export default checkInSlice.reducer;