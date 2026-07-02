import React from 'react'
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
import { useAppDispatch } from './app/reduxHooks';
import { fetchCurrentUser } from './features/auth/authThunk';


import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      dispatch(fetchCurrentUser(token));
    }
  }, [dispatch])

  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;