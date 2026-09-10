/**
 * File: App.tsx
 * Purpose: Defines the application's public, protected, and Trial-aware routes.
 * Component: App.
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import RequireAuth from "./components/RequireAuth";
import { useAuth } from "./context/useAuth";
import CalendarPage from "./pages/calendar";
import IntroPage from "./pages/intro";
import Login from "./pages/login";
import ProfilePage from "./pages/profile";
import Register from "./pages/register";
import TasksPage from "./pages/tasks";
import TodayPage from "./pages/today";

export default function App() {
  const { isTrial } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/today" element={<TodayPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route
              path="/profile"
              element={isTrial ? <Navigate to="/today" replace /> : <ProfilePage />}
            />
            <Route path="/dashboard" element={<Navigate to="/today" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
