import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserProvider";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";

// Pages
import Login from "./Login";
import Register from "./Register";
import ChangePasswordCard from "./trial/Changepassword";
import CrudStudents from "./Admin_section/Crudstudents";
import MakeAdmin from "./tanushree/MakeAdmin";
import StudentDetails from "./trial/StudentDetails";
import Complaints from "./trial/Complaints";
import InterviewPrep from "./trial/InterviewPrep";
import Cards from "./cards"; // 👈 import this for index route

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />

      {/* Protected Layout Route with Nested Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Nested Routes - rendered inside Dashboard's <Outlet /> */}
        <Route index element={<Cards />} />
        <Route path="changepassword" element={<ChangePasswordCard />} />
        <Route path="students" element={<CrudStudents />} />
        <Route path="updatedetails" element={<StudentDetails />} />
        <Route path="superadmin" element={<MakeAdmin />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="interview" element={<InterviewPrep />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
