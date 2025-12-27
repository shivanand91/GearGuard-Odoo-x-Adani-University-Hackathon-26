import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Equipment from "../pages/dashboard/Equipment";
import Requests from "../pages/dashboard/Requests";
import Calendar from "../pages/dashboard/Calendar";
import Teams from "../pages/dashboard/Teams";
import { useAuth } from "../hooks/useAuth";


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/"
      element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="equipment" element={<Equipment />} />
      <Route path="requests" element={<Requests />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="teams" element={<Teams />} />
    </Route>
  </Routes>
);

export default AppRoutes;
