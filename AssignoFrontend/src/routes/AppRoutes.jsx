import React from 'react'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import { Route, Routes } from 'react-router-dom';
import Projects from '../pages/Projects';
import NavBar from '../components/NavBar';
import AuthLayout from '../layouts/authLayout';
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
