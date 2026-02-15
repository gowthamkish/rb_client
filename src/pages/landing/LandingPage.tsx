import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import BrushIcon from "@mui/icons-material/Brush";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SaveIcon from "@mui/icons-material/Save";
import SyncIcon from "@mui/icons-material/Sync";
import WorkIcon from "@mui/icons-material/Work";

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  style: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

  const templates: Template[] = [
    {
      id: "classic",
      name: "Classic",
      description: "Professional and timeless design",
      image: "🎯",
      style: "classic",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary and clean layout",
      image: "✨",
      style: "modern",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold and eye-catching design",
      image: "🎨",
      style: "creative",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant style",
      image: "📋",
      style: "minimal",
    },
    {
      id: "ats",
      name: "ATS-Friendly",
      description: "Optimized for scanning software",
      image: "✓",
      style: "ats",
    },
    {
      id: "executive",
      name: "Executive",
      description: "Sophisticated and formal",
      image: "💼",
      style: "executive",
    },
  ];

  const features = [
    {
      icon: <RocketLaunchIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Fast & Easy",
      description: "Create your resume in minutes with our intuitive builder",
    },
    {
      icon: <BrushIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Beautiful Templates",
      description: "Choose from professionally designed resume templates",
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "ATS Compatible",
      description: "Your resume will pass through applicant tracking systems",
    },
    {
      icon: <SaveIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Save & Download",
      description: "Save your work and download in PDF or DOCX format",
    },
    {
      icon: <SyncIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Multiple Resumes",
      description: "Create and manage multiple resumes for different jobs",
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Get Hired",
      description: "Join thousands who landed their dream job with us",
    },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/builder");
    } else {
      navigate("/signup");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  variant="h1"
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    lineHeight: 1.2,
                    mb: 3,
                  }}
                >
                  Create Your Perfect Resume
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 400,
                    mb: 4,
                    lineHeight: 1.7,
                  }}
                >
                  Stand out from the competition with a professionally designed
                  resume. Only 2% of resumes win. Yours will be one of them.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  sx={{ mb: 5 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "white", fontWeight: 700 }}
                    >
                      39%
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      More likely to land a job
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "white", fontWeight: 700 }}
                    >
                      10 min
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Average creation time
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "white", fontWeight: 700 }}
                    >
                      100K+
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      Resumes created
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStarted}
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    Get Started Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    View Examples
                  </Button>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Card
                  sx={{
                    maxWidth: 350,
                    mx: "auto",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                    transform: "rotate(3deg)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "rotate(0deg) scale(1.02)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "primary.main" }}
                      >
                        John Doe
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Senior Developer
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="overline"
                        sx={{ color: "primary.main", fontWeight: 600 }}
                      >
                        Experience
                      </Typography>
                      <Typography variant="body2">
                        Lead Product Developer at Tech Corp
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "primary.main", fontWeight: 600 }}
                      >
                        Skills
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Chip label="React" size="small" color="primary" />
                        <Chip label="Node.js" size="small" color="primary" />
                        <Chip label="MongoDB" size="small" color="primary" />
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
            >
              Why Choose ResumeBuilder?
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontWeight: 400 }}
            >
              Everything you need to create a winning resume
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Templates Section */}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
            >
              Choose Your Template
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontWeight: 400 }}
            >
              Select from our professionally designed templates
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {templates.map((template) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.2)",
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={handleGetStarted}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Box
                      sx={{
                        fontSize: "4rem",
                        mb: 2,
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {template.image}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                    >
                      {template.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {template.description}
                    </Typography>
                    <Chip
                      label={template.style}
                      color="primary"
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, mb: 2, color: "white" }}
            >
              Ready to Transform Your Resume?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 400,
                mb: 4,
              }}
            >
              Join thousands of job seekers who've already landed their dream
              job
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 5,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Start Creating Now - It's Free!
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: "background.paper", textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} ResumeBuilder. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
