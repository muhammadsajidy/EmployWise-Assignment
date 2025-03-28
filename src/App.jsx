import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";


export default function App() {
  const [token, setToken] = useState(localStorage.getItem("session-token"));

  useEffect(() => {
    const checkToken = () => {
        setToken(localStorage.getItem("session-token"));
    };
    
    window.addEventListener("storage", checkToken); 
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login setToken={setToken}/> : <Navigate to="/" />}/>
      </Routes>
    </BrowserRouter>
  );
};