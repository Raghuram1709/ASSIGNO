import React from 'react'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import VerifyOtp from '../pages/VerifyOtp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import { Route, Routes } from 'react-router-dom';
import Projects from '../pages/Projects';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import ProtectedRoute from './ProtectedRoute';
import ProjectDashboard from '../pages/ProjectDashboard';
import NotificationsPage from "../pages/NotificationPage";
import ProfilePage from '../pages/ProfilePage';
import ProjectSettings from '../pages/ProjectSettings';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route element={<MainLayout />} >
          <Route path="/" element={<Home />} />
          <Route path='/projects' element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />
          <Route path='/projects/:projectCode' element={
            <ProtectedRoute>
              <ProjectDashboard />
            </ProtectedRoute>
          } />
          <Route path='/projects/:projectCode/settings' element={
            <ProtectedRoute>
              <ProjectSettings />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
          />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </>
  )
}

export default AppRoutes;
