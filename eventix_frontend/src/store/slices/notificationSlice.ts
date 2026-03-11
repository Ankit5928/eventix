import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SaleNotification,
  NotificationState,
} from "../../types/notification.types";

const initialState: NotificationState = {
  notifications: [],
  isLive: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<SaleNotification>) => {
      // Keep only the last 5 notifications to avoid memory issues
      state.notifications = [action.payload, ...state.notifications].slice(
        0,
        5,
      );
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isLive = action.payload;
    },
    setNotificationError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addNotification, setConnectionStatus, setNotificationError } =
  notificationSlice.actions;
export default notificationSlice.reducer;
