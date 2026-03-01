import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { authService, resumeService } from "../../services/api";
import { useResumeStore } from "../../store/resumeStore";
import type {
  Resume,
  Experience,
  Education,
  Skill,
} from "../../store/resumeStore";
import toast from "react-hot-toast";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      );
      localStorage.setItem("token", response.data.token);
      toast.success("Logged in successfully!");
      // After login, fetch resumes for the logged-in user and prefill builder
      const setResumes = useResumeStore.getState().setResumes;
      const setResume = useResumeStore.getState().setResume;
      try {
        const res = await resumeService.getResumes();
        const list = res.data || [];
        if (Array.isArray(list) && list.length > 0) {
          const normalizedList = list.map(
            (first: Record<string, unknown>): Resume => {
              const personalInfo =
                (first.personalInfo as Record<string, unknown>) || {};
              return {
                id: (first._id || first.id || "") as string,
                title: (first.title || "New Resume") as string,
                personalInfo: {
                  fullName: (personalInfo.fullName || "") as string,
                  email: (personalInfo.email || "") as string,
                  phone: (personalInfo.phone || "") as string,
                  location: (personalInfo.location || "") as string,
                  professionalSummary: (personalInfo.professionalSummary ||
                    "") as string,
                },
                experiences: (first.experiences || []) as Experience[],
                education: (first.education || []) as Education[],
                skills: (first.skills || []) as Skill[],
                selectedTemplate: (first.selectedTemplate ||
                  "classic") as string,
                createdAt: (first.createdAt ||
                  new Date().toISOString()) as string,
                updatedAt: (first.updatedAt ||
                  new Date().toISOString()) as string,
              };
            },
          );

          setResumes(normalizedList);
          setResume(normalizedList[0]);
        }
      } catch (err) {
        // Non-fatal: continue to builder even if resume fetch fails
        console.warn("Failed to prefetch resumes after login", err);
      }

      navigate("/builder");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "An error occurred");
      toast.error(error.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Login to your account to continue
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: "1rem",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/signup"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign up here
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
