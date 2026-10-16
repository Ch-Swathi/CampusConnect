import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

// Login
import Login from "./pages/login";

// Student pages
import Dashboard from "./pages/student/Dashboard";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import ComplaintDetails from "./pages/student/ComplaintDetails";
import AllComplaints from "./pages/student/AllComplaints";

import LostFound from "./pages/student/LostFound";
import ReportLost from "./pages/student/ReportLost";
import ReportFound from "./pages/student/ReportFound";
import MyLostFound from "./pages/student/MyLostFound";

import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";
import StudentSettings from "./pages/student/Settings";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ComplaintManagement from "./pages/admin/ComplaintManagement";
import Students from "./pages/admin/Students";
import Departments from "./pages/admin/Departments";
import LostFoundManagement from "./pages/admin/LostFoundManagement";
import Announcements from "./pages/admin/Announcements";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= STUDENT ================= */}

        <Route
          path="/student/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/student/submit-complaint"
          element={
            <Layout>
              <SubmitComplaint />
            </Layout>
          }
        />

        <Route
          path="/student/complaints"
          element={
            <Layout>
              <MyComplaints />
            </Layout>
          }
        />

        <Route
          path="/student/complaint/:id"
          element={
            <Layout>
              <ComplaintDetails />
            </Layout>
          }
        />

        <Route
          path="/student/all-complaints"
          element={
            <Layout>
              <AllComplaints />
            </Layout>
          }
        />

        <Route
          path="/student/lost-found"
          element={
            <Layout>
              <LostFound />
            </Layout>
          }
        />

        <Route
          path="/student/report-lost"
          element={
            <Layout>
              <ReportLost />
            </Layout>
          }
        />

        <Route
          path="/student/report-found"
          element={
            <Layout>
              <ReportFound />
            </Layout>
          }
        />

        <Route
          path="/student/my-lost-found"
          element={
            <Layout>
              <MyLostFound />
            </Layout>
          }
        />

        <Route
          path="/student/notifications"
          element={
            <Layout>
              <Notifications />
            </Layout>
          }
        />

        <Route
          path="/student/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/student/settings"
          element={
            <Layout>
              <StudentSettings />
            </Layout>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <Layout>
              <ComplaintManagement />
            </Layout>
          }
        />

        <Route
          path="/admin/students"
          element={
            <Layout>
              <Students />
            </Layout>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <Layout>
              <Departments />
            </Layout>
          }
        />

        <Route
          path="/admin/lost-found"
          element={
            <Layout>
              <LostFoundManagement />
            </Layout>
          }
        />

        <Route
          path="/admin/announcements"
          element={
            <Layout>
              <Announcements />
            </Layout>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <Layout>
              <Reports />
            </Layout>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <Layout>
              <AdminSettings />
            </Layout>
          }
        />

        {/* ================= DEFAULT ================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;