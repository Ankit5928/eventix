import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventService from "../../service/eventService";
import { EventListItemDTO } from "../../types/event.types";

interface EventState {
  dashboardEvents: EventListItemDTO[];
  currentEvent: any | null;
  isLoading: boolean;
}

const initialState: EventState = {
  dashboardEvents: [],
  currentEvent: null,
  isLoading: false,
};

export const fetchOrgEvents = createAsyncThunk(
  "events/fetchOrgEvents",
  async ({
    orgId,
    search,
    page,
  }: {
    orgId: number;
    search?: string;
    page?: number;
  }) => {
    return await eventService.getOrgEvents(orgId, search, page);
  },
);

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrgEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardEvents = action.payload.content;
      });
  },
});

export const { clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
