import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import attendeeService from "../../service/attendeeService";
import {
  AttendeeDTO,
  AttendeeFilters,
  PaginatedResponse,
} from "../../types/attendee.types";

interface AttendeeState {
  attendees: AttendeeDTO[];
  pagination: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: AttendeeState = {
  attendees: [],
  pagination: { totalPages: 0, totalElements: 0, currentPage: 0 },
  isLoading: false,
  error: null,
};

export const fetchAttendees = createAsyncThunk(
  "attendees/fetchAll",
  async (
    { eventId, filters }: { eventId: number; filters: AttendeeFilters },
    thunkAPI,
  ) => {
    try {
      return await attendeeService.getEventAttendees(eventId, filters);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch attendees",
      );
    }
  },
);

const attendeeSlice = createSlice({
  name: "attendees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAttendees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendees = action.payload.content;
        state.pagination = {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          currentPage: action.payload.number,
        };
      })
      .addCase(fetchAttendees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default attendeeSlice.reducer;
