import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/muiTheme";
import Header from "./components/common/Header";
import LandingPage from "./pages/landing/LandingPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ResumeBuilder from "./pages/builder/ResumeBuilder";
import Dashboard from "./pages/dashboard/Dashboard";
import { useResumeStore } from "./store/resumeStore";
import "./App.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const setResume = useResumeStore((state) => state.setResume);

  useEffect(() => {
    // Initialize a new resume on app load
    setResume({
      id: "",
      title: "New Resume",
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        professionalSummary: "",
      },
      experiences: [],
      education: [],
      skills: [],
      selectedTemplate: "classic",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [setResume]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
