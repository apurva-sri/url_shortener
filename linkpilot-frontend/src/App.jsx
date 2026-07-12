import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing.jsx";
import Register from "./pages/Register/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP/VerifyOTP.jsx";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import MyLinks from "./pages/MyLinks/MyLinks.jsx";
import QRCodes from "./pages/QRCodes/QRCodes.jsx";
import Analytics from "./pages/Analytics/Analytics.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import RedirectPage from "./pages/RedirectPage/RedirectPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="links" element={<MyLinks />} />
        <Route path="qr" element={<QRCodes />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/:shortCode" element={<RedirectPage />} />
    </Routes>
  );
}
