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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/api";
import toast from "react-hot-toast";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Guard: if token or email missing in URL, show a clear error
  const isMissingParams = !token || !email;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, email, formData.newPassword);
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { detail?: string; message?: string } };
      };
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Failed to reset password. The link may have expired.";
      setError(msg);
      toast.error(msg);
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
          sx={{ boxShadow: "0 25px 50px rgba(0,0,0,0.15)", borderRadius: 4 }}
        >
          <CardContent sx={{ p: 5 }}>
            {isMissingParams ? (
              /* ── Invalid link ── */
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" fontWeight={700} mb={2} color="error">
                  Invalid Reset Link
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  This password reset link is invalid or has already been used.
                  Please request a new one.
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/forgot-password"
                  sx={{ mr: 2 }}
                >
                  Request New Link
                </Button>
                <Button variant="outlined" component={Link} to="/login">
                  Back to Login
                </Button>
              </Box>
            ) : success ? (
              /* ── Success state ── */
              <Box sx={{ textAlign: "center" }}>
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 64, color: "success.main", mb: 2 }}
                />
                <Typography variant="h5" fontWeight={700} mb={1}>
                  Password Updated!
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  Your password has been reset successfully. You can now log in
                  with your new password.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{ px: 4 }}
                >
                  Go to Login
                </Button>
              </Box>
            ) : (
              /* ── Form state ── */
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    Create New Password
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Your new password must be at least 6 characters long.
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
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    autoFocus
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

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
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
                            onClick={() => setShowConfirm(!showConfirm)}
                            edge="end"
                          >
                            {showConfirm ? (
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
                    sx={{ py: 1.5, mb: 3, fontSize: "1rem" }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                  <MuiLink
                    component={Link}
                    to="/login"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontWeight: 600,
                      textDecoration: "none",
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <ArrowBackIcon fontSize="small" />
                    Back to Login
                  </MuiLink>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ResetPassword;
