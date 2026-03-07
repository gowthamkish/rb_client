import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/muiTheme";
import Header from "./components/common/Header";
import Loader from "./components/common/Loader";
import { useLoader } from "./context/loaderContext";
import {
  resumeService,
  subscriptionService,
  setupAxiosLoader,
} from "./services/api";
import { useUserStore } from "./store/userStore";
import LandingPage from "./pages/landing/LandingPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
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
  const setResumes = useResumeStore((state) => state.setResumes);
  const setUser = useUserStore((state) => state.setUser);

  // Connect axios interceptors to the loader context
  const { showLoader, hideLoader } = useLoader();
  useEffect(() => {
    setupAxiosLoader(showLoader, hideLoader);
  }, [showLoader, hideLoader]);

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
      languages: [],
      socialLinks: [],
      certifications: "",
      awards: "",
      hobbies: [],
      selectedTemplate: "classic",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setResume(initial);

    // If logged in, try to fetch existing resumes from server and prefill
    const token = localStorage.getItem("token");
    if (token && !_hasPrefetchedResumes) {
      // Load current user's profile (includes plan)
      (async () => {
        try {
          const meRes = await subscriptionService.getMe();
          if (meRes.data?.user) {
            setUser(meRes.data.user);
          }
        } catch {
          // silent fail – user store stays null; plan defaults to free in UI
        }
      })();

      (async () => {
        try {
          const res = await resumeService.getResumes();
          const list = res.data || [];
          if (Array.isArray(list) && list.length > 0) {
            // Normalize server document shape to client Resume
            const normalizedList = list.map(
              (first: Record<string, unknown>) => {
                const normalized = {
                  id: (first._id as string) || (first.id as string) || "",
                  title: (first.title as string) || initial.title,
                  personalInfo:
                    (first.personalInfo as typeof initial.personalInfo) ||
                    initial.personalInfo,
                  experiences:
                    (first.experiences as typeof initial.experiences) ||
                    initial.experiences,
                  education:
                    (first.education as typeof initial.education) ||
                    initial.education,
                  skills:
                    (first.skills as typeof initial.skills) || initial.skills,
                  languages:
                    (first.languages as typeof initial.languages) ||
                    initial.languages,
                  socialLinks:
                    (first.socialLinks as typeof initial.socialLinks) ||
                    initial.socialLinks,
                  certifications:
                    (first.certifications as string) || initial.certifications,
                  awards: (first.awards as string) || initial.awards,
                  hobbies:
                    (first.hobbies as typeof initial.hobbies) ||
                    initial.hobbies,
                  selectedTemplate:
                    (first.selectedTemplate as string) ||
                    initial.selectedTemplate,
                  createdAt: (first.createdAt as string) || initial.createdAt,
                  updatedAt: (first.updatedAt as string) || initial.updatedAt,
                };
                return normalized;
              },
            );

            // Populate global resumes list and set current resume to the first
            setResumes(normalizedList);
            setResume(normalizedList[0]);
          }
          // mark as prefetched so the effect won't re-fetch during StrictMode
          _hasPrefetchedResumes = true;
        } catch (err) {
          // silent fail (keep initial state)
          console.warn("Failed to load resumes for user", err);
        }
      })();
    }
  }, [setResume, setUser]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Loader />
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
