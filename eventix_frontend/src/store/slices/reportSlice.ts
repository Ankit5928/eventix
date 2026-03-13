import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "../../service/reportService";
import { OrganizationSummaryDTO, RevenueReportDTO } from "../../types/report.types";

export const fetchOrgDashboard = createAsyncThunk(
  "reports/fetchDashboard",
  async (orgId: number) => {
    const summary = await reportService.getOrgSummary(orgId);
    const revenue = await reportService.getRevenueByEvent(orgId);
    return { summary, revenue };
  }
);

interface ReportState {
  orgSummary: OrganizationSummaryDTO | null;
  revenueByEvent: RevenueReportDTO[];
  isLoading: boolean;
}

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    orgSummary: null,
    revenueByEvent: [],
    isLoading: false,
  } as ReportState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrgDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orgSummary = action.payload.summary;
        state.revenueByEvent = action.payload.revenue;
      })
      .addCase(fetchOrgDashboard.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reportSlice.reducer;
