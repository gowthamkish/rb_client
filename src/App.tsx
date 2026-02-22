import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/muiTheme";
import Header from "./components/common/Header";
import { resumeService } from "./services/api";
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

// Module-scoped flag to avoid duplicate resume fetches in development
// React 18 StrictMode intentionally mounts, unmounts, and remounts
// components which can cause mount-effects to run twice. This flag
// persists across the dev double-mount cycle and prevents re-fetching.
let _hasPrefetchedResumes = false;

function App() {
  const setResume = useResumeStore((state) => state.setResume);

  useEffect(() => {
    // Initialize a new resume on app load
    const initial = {
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
    };

    setResume(initial);

    // If logged in, try to fetch existing resumes from server and prefill
    const token = localStorage.getItem("token");
    if (token && !_hasPrefetchedResumes) {
      (async () => {
        try {
          const res = await resumeService.getResumes();
          const list = res.data || [];
          if (Array.isArray(list) && list.length > 0) {
            const first = list[0];
            // Normalize server document shape to client Resume
            const normalized = {
              id: first._id || first.id || "",
              title: first.title || initial.title,
              personalInfo: first.personalInfo || initial.personalInfo,
              experiences: first.experiences || initial.experiences,
              education: first.education || initial.education,
              skills: first.skills || initial.skills,
              selectedTemplate:
                first.selectedTemplate || initial.selectedTemplate,
              createdAt: first.createdAt || initial.createdAt,
              updatedAt: first.updatedAt || initial.updatedAt,
            };
            setResume(normalized as any);
          }
          // mark as prefetched so the effect won't re-fetch during StrictMode
          _hasPrefetchedResumes = true;
        } catch (err) {
          // silent fail (keep initial state)
          console.warn("Failed to load resumes for user", err);
        }
      })();
    }
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
