import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Import all the slices we created
import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice";
import attendeeReducer from "./slices/attendeeSlice";
import checkInReducer from "./slices/checkInSlice";
import notificationReducer from "./slices/notificationSlice";
import orderReducer from "./slices/orderSlice";
import reportReducer from "./slices/reportSlice";
import organizationReducer from "./slices/organizationSlice";
import paymentReducer from "./slices/paymentSlice";
import paymentIntentReducer from "./slices/paymentIntentSlice";
import publicReducer from "./slices/publicSlice";
import reservationReducer from "./slices/reservationSlice";
import ticketCategoryReducer from "./slices/ticketCategorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    attendees: attendeeReducer,
    checkin: checkInReducer,
    notifications: notificationReducer,
    orders: orderReducer,
    reports: reportReducer,
    organization: organizationReducer,
    payment: paymentReducer,
    paymentIntent: paymentIntentReducer,
    public: publicReducer,
    reservation: reservationReducer,
    ticketCategories: ticketCategoryReducer,
  },
  // Middleware for serializable checks (helps with dates/UUIDs)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Types for your entire State and Dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom Hooks: Use these instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
