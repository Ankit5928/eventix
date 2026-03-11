import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrgDashboard = createAsyncThunk(
  'reports/fetchDashboard',
  async (_orgId: string) => {
    // In a real app this would call apiClient.get(`/reports/dashboard/${orgId}`)
    return {
      totalRevenue: 15420,
      totalAttendees: 450,
      activeEventsCount: 3,
      totalEvents: 8
    };
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    orgSummary: null as any,
    revenueByEvent: [
      { eventId: '1', eventTitle: 'Summer Tech Conf', totalRevenue: 8500 },
      { eventId: '2', eventTitle: 'Music Festival', totalRevenue: 6920 },
    ],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrgDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orgSummary = action.payload;
      })
      .addCase(fetchOrgDashboard.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reportSlice.reducer;
