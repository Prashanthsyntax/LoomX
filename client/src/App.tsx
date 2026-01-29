import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./globals.css";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Profile from "./pages/dashboard/Profile";
import Home from "./pages/dashboard/Home";
import Activity from "./pages/dashboard/Activity";
import Settings from "./pages/dashboard/Settings";

export default function App() {
  return (
    <>
      <Routes>
      {/* Pages WITH Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Pages WITHOUT Navbar + Footer */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/home" element={<Home />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/activity" element={<Activity />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>
    </Routes>
    </>
  );
}
