import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/index";

// Layouts
import MainLayout from "../components/layouts/MainLayout";
import PublicLayout from "../components/layouts/PublicLayout";

// Pages
import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import EventsPage from "../pages/EventsPage";
import AttendeesPage from "../pages/AttendeesPage";
import SettingsPage from "../pages/SettingsPage";
import EventListingPage from "../pages/public/EventListingPage";
import EventDetailPage from "../pages/public/EventDetailPage";
import CheckoutPage from "../pages/public/CheckoutPage";

const AppRoutes = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* PUBLIC ROUTES (Attendee View) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<EventListingPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/checkout/:reservationId" element={<CheckoutPage />} />
      </Route>

      {/* AUTH ROUTES */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />}
      />

      {/* PROTECTED ROUTES (Organizer View) */}
      <Route element={user ? <MainLayout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId/attendees" element={<AttendeesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
