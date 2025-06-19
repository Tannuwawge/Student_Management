// AppRoutes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserProvider";
import ProtectedRoute from "./ProtectedRoute";
import InterviewPrep from './trial/InterviewPrep.jsx'
// Component imports
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import ChangePasswordCard from "./trial/Changepassword";
import CrudStudents from "./Admin_section/Crudstudents.jsx";
import MakeAdmin from "./tanushree/MakeAdmin.jsx";
import StudentDetails from "./trial/StudentDetails.jsx";
import Complaints from "./trial/Complaints.jsx";

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

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/changepassword"
        element={
          <ProtectedRoute>
            <ChangePasswordCard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/students"
        element={
          <ProtectedRoute>
            <CrudStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/updatedetails"
        element={
          <ProtectedRoute>
            <StudentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin"
        element={
          <ProtectedRoute>
            <MakeAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/complaints"
        element={
          <ProtectedRoute>
            <Complaints />
          </ProtectedRoute>
        }
      />
      <Route
  path="/dashboard/interview"
  element={
    <ProtectedRoute>
      <InterviewPrep />
    </ProtectedRoute>
  }
/>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes; // 🚀 This is the missing piece!
