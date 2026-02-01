import { Route, Routes } from "react-router-dom";
import "./globals.css";

import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import DashboardHome from "./pages/dashboard/DashboardHome";
import Portfolio from "./pages/dashboard/Portfolio";
import Activity from "./pages/dashboard/Activity";
import Settings from "./pages/dashboard/Settings";
import AuthPage from "./pages/auth/AuthPage";

import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import BankingOp from "./pages/dashboard/BankingOp";
import Market from "./pages/dashboard/Market";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Auth page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Dashboard */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/portfolio" element={<Portfolio />} />
          <Route path="/dashboard/banking-op" element={<BankingOp />} />
          <Route path="/dashboard/market" element={<Market />} />
          <Route path="/dashboard/activity" element={<Activity />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
