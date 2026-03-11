import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import all your slices
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import attendeeReducer from './slices/attendeeSlice';
import checkInReducer from './slices/checkInSlice';
import notificationReducer from './slices/notificationSlice';
import orderReducer from './slices/orderSlice';
import reportReducer from './slices/reportSlice';
import organizationReducer from './slices/organizationSlice';

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
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;