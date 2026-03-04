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
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { authService } from "../../services/api";
import toast from "react-hot-toast";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
      toast.success("Reset email sent! Check your inbox.");
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { detail?: string; message?: string } };
      };
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Failed to send reset email. Please try again.";
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
            {submitted ? (
              /* ── Success state ── */
              <Box sx={{ textAlign: "center" }}>
                <MarkEmailReadOutlinedIcon
                  sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h5" fontWeight={700} mb={1}>
                  Check your inbox
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  We've sent a password reset link to <strong>{email}</strong>.
                  The link expires in 60 minutes.
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Didn't receive it? Check your spam folder or{" "}
                  <MuiLink
                    component="button"
                    onClick={() => setSubmitted(false)}
                    sx={{ fontWeight: 600, cursor: "pointer" }}
                  >
                    try again
                  </MuiLink>
                  .
                </Typography>
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
                    Forgot Password?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter the email associated with your account and we'll send
                    you a link to reset your password.
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
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                    autoFocus
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
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
                      "Send Reset Link"
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

export default ForgotPassword;
