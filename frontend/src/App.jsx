import axios from "axios";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalState from "./contexts/GlobalState";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

axios.defaults.baseURL = "http://localhost:5000/api";

export default function App() {

  const [authenticatedUser, setAuthenticatedUser] = useState();

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('auth_token');

      axios({
        url: '/user',
        method: 'get',
      })
        .then(res => {
          console.log(res.data)
          setAuthenticatedUser(res.data)
        })
        .catch(res => {
          console.log(res.response)
        })
    }
  }, []);

  const PrivateRoute = (component) => {
    const auth = authenticatedUser;
    return auth?.id ? component : <Login />;
  }

  return (
    <GlobalState.Provider value={{authenticatedUser, setAuthenticatedUser}}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/dashboard" element={PrivateRoute(<Dashboard />)} />
        </Routes>
      </BrowserRouter>
    </GlobalState.Provider>
  )
}