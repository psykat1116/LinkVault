import axios from "axios";
import { useEffect } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";

import Link from "./Link";
import Home from "./Home";
import Error from "./Error";
import Create from "./Create";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { BackendURL } from "../../../data";
import Dashboard from "./Dashboard";

const MainLayout = () => {
  const data = localStorage.getItem("userData");
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        await axios.get(`${BackendURL}/api/auth/ping`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");
        }
      }
    };

    verifySession();
  }, []);

  return (
    <main className="min-h-screen bg-background text-accent-foreground font-poppins">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<Create />} />
          <Route path="/link/:id" element={<Link />} />
          <Route
            path="/auth/signin"
            element={data && token ? <Navigate to="/" replace /> : <SignIn />}
          />
          <Route
            path="/auth/signup"
            element={data && token ? <Navigate to="/" replace /> : <SignUp />}
          />
          <Route
            path="/dashboard"
            element={
              data && token ? (
                <Dashboard />
              ) : (
                <Navigate to="/auth/signin" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              <Error
                code={404}
                message="Page Not Found"
                description="The paste you're looking for doesn't exist or may have been
              deleted."
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default MainLayout;
