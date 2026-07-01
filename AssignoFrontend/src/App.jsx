import React from 'react'
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
import { useAppDispatch } from './app/reduxHooks';
import { fetchCurrentUser } from './features/auth/authThunk';


function App() {
  console.log("App Rendered");
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("UseEffect Hit")
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      dispatch(fetchCurrentUser(token));
    }
  }, [dispatch])

  return (
    <>
      <AppRoutes />
      {/* <ToastContainer/> */}
    </>
  );
}

export default App;