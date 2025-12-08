import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth component

// Auth pages
import { LoginPage } from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Layouts
import LayoutDeFault from "./Layouts/LayoutDefault";
import LayoutStaff from "./Layouts/LayoutStaff";
import LayoutAdmin from "./Layouts/LayoutAdmin";

// Public pages
import Homepage from "./pages/home";
import Contact from "./pages/home/Contact";
import AboutUs from "./pages/home/AboutUs";
import BloodTypeInfo from "./pages/home/BloodTypeInfo";
import EmergencyRequest from "./pages/home/EmergencyRequest";
import DonateBlood from "./pages/home/DonateBlood";
import { FAQPage } from "./pages/home/FAQ";
import News from "./pages/home/News";
import BlogDetail from "./pages/home/BlogDetail";
import History from "./pages/home/history";
import PatientHistory from "./pages/home/patienthistory";

// Staff pages
import DashboardPage from "./pages/Staff/Dashboard";
import EditBloodPage from "./pages/Staff/EditBlood";
import ConfirmBloodPage from "./pages/Staff/ConfirmBlood";
import ManageEmergencyPage from "./pages/Staff/ManageEmergency";

// Admin pages
import AdminDashboard from "./pages/Admin";
import CreateSlot from "./pages/Admin/CreateSlot";
import RoleManage from "./pages/Admin/Rolemange";
import BloodInventory from "./pages/Admin/BloodInventory";
import AdminEmergencyRequest from "./pages/Admin/EmergencyRequest";
import ProtectedRoute from "./components/auth/RequireRole";
import AdminLayout from "./Layouts/LayoutAdmin";
import { RegisterPage } from "./pages/auth/Register";
import ProfilePage from "./pages/auth/Profile";
import BlogAdmin from "./pages/Admin/BlogAdmin";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import StaffReportHistory from "./pages/Admin/StaffReportHistory";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Các route công khai */}
          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutDeFault />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/blood-type-info" element={<BloodTypeInfo />} />
              <Route path="/donate" element={<DonateBlood />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<BlogDetail />} />
              <Route path="/history" element={<History />} />
              <Route path="/patienthistory" element={<PatientHistory />} />
            </Route>
          </Route>

          {/* Các route xác thực (chuyển hướng nếu đã đăng nhập) */}
          <Route element={<ProtectedRoute restricted={true} />}>
            <Route element={<LayoutDeFault />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Các route yêu cầu đăng nhập */}
          <Route
            element={
              <ProtectedRoute requireAuth={true} allowedRoles={["member"]} />
            }
          >
            <Route element={<LayoutDeFault />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/emergency" element={<EmergencyRequest />} />
              <Route path="/emergency-history" element={<History />} />
            </Route>
          </Route>

          {/* Các route dành riêng cho staff */}
          <Route
            element={
              <ProtectedRoute requireAuth={true} allowedRoles={["staff"]} />
            }
          >
            <Route element={<LayoutStaff />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/edit-blood" element={<EditBloodPage />} />
              <Route path="/confirm-blood" element={<ConfirmBloodPage />} />
              <Route
                path="/manage-emergency"
                element={<ManageEmergencyPage />}
              />
              <Route path="/staff/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Các route dành riêng cho admin */}
          <Route
            element={
              <ProtectedRoute requireAuth={true} allowedRoles={["admin"]} />
            }
          >
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create-slot" element={<CreateSlot />} />
              <Route path="/admin/manage-role" element={<RoleManage />} />
              <Route path="/admin/report-history" element={<StaffReportHistory />} />
              <Route
                path="/admin/blood-inventory"
                element={<BloodInventory />}
              />
              <Route path="/admin/blog" element={<BlogAdmin />} />
              <Route
                path="/admin/emergency-request"
                element={<AdminEmergencyRequest />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
