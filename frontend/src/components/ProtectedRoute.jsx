import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader full label="Checking your session" />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader full label="Checking your session" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader full label="Loading NutriTrack" />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
