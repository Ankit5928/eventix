import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import reportReducer from "./slices/reportSlice";
import eventReducer from "./slices/eventSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
    events: eventReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
