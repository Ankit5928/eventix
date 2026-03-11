import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketCategoryService from '../../service/ticketCategoryService';
import { TicketCategoryResponse, CategoryStatsDTO } from '../../types/ticket-category.types';

interface TicketCategoryState {
  categories: TicketCategoryResponse[];
  stats: CategoryStatsDTO[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TicketCategoryState = {
  categories: [],
  stats: [],
  isLoading: false,
  error: null,
};

export const fetchEventCategories = createAsyncThunk(
  'ticketCategories/fetchAll',
  async ({ eventId, internal }: { eventId: number; internal?: boolean }) => {
    return await ticketCategoryService.getCategories(eventId, internal);
  }
);

const ticketCategorySlice = createSlice({
  name: 'ticketCategories',
  initialState,
  reducers: {
    resetCategoryState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load categories';
      });
  },
});

export const { resetCategoryState } = ticketCategorySlice.actions;
export default ticketCategorySlice.reducer;