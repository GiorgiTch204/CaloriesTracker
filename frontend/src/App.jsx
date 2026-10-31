import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Diary from "./pages/Diary";
import FoodDatabase from "./pages/FoodDatabase";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/diary" element={<Diary />} />
                  <Route path="/foods" element={<FoodDatabase />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<Admin />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
