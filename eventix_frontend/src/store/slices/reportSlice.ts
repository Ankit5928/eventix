import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import reportService from "../../service/reportService";
import {
  OrganizationSummaryDTO,
  RevenueReportDTO,
  EventSummaryDTO,
  SalesTimeSeriesDTO,
} from "../../types/report.types";

interface ReportState {
  // Organization Level
  orgSummary: OrganizationSummaryDTO | null;
  revenueByEvent: RevenueReportDTO[];

  // Event Level
  eventSummary: EventSummaryDTO | null;
  salesTrend: SalesTimeSeriesDTO[];

  // UI State
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  orgSummary: null,
  revenueByEvent: [],
  eventSummary: null,
  salesTrend: [],
  isLoading: false,
  error: null,
};

/**
 * Thunk: Fetch high-level organization dashboard data
 */
export const fetchOrgDashboard = createAsyncThunk(
  "reports/fetchOrgDashboard",
  async (orgId: number, { rejectWithValue }) => {
    try {
      const [summary, revenue] = await Promise.all([
        reportService.getOrgSummary(orgId),
        reportService.getRevenueByEvent(orgId),
      ]);
      return { summary, revenue };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to load organization reports",
      );
    }
  },
);

/**
 * Thunk: Fetch specific event analytics summary and trends
 */
export const fetchEventAnalytics = createAsyncThunk(
  "reports/fetchEventAnalytics",
  async (
    {
      eventId,
      groupBy,
    }: { eventId: number; groupBy?: "DAY" | "WEEK" | "MONTH" },
    { rejectWithValue },
  ) => {
    try {
      const [summary, trend] = await Promise.all([
        reportService.getEventSummary(eventId),
        reportService.getSalesTrend(eventId, groupBy),
      ]);
      return { summary, trend };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to load event analytics",
      );
    }
  },
);

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportState: (state) => {
      state.orgSummary = null;
      state.eventSummary = null;
      state.salesTrend = [];
      state.error = null;
    },
    setManualError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Organization Dashboard Actions
    builder
      .addCase(fetchOrgDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrgDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orgSummary = action.payload.summary;
        state.revenueByEvent = action.payload.revenue;
      })
      .addCase(fetchOrgDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Event Analytics Actions
    builder
      .addCase(fetchEventAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventSummary = action.payload.summary;
        state.salesTrend = action.payload.trend;
      })
      .addCase(fetchEventAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReportState } = reportSlice.actions;
export default reportSlice.reducer;
