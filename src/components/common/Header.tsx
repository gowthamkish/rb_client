import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useResumeStore } from "../../store/resumeStore";

interface HeaderProps {
  onSave?: () => void;
  onDownloadPDF?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSave, onDownloadPDF }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isBuilderPage = location.pathname === "/builder";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setMobileOpen(false);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      return;
    }

    const saveDraft = useResumeStore.getState().saveDraft;
    if (saveDraft) {
      saveDraft();
      toast.success("Draft saved locally");
    } else {
      toast.success("Resume saved successfully!");
    }
  };

  const handleDownloadPDF = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
    } else {
      toast.success("Downloading resume as PDF...");
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = isAuthenticated
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Create Resume", path: "/builder" },
      ]
    : [
        { label: "Login", path: "/login" },
        { label: "Sign Up", path: "/signup" },
      ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", py: 2 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
        }}
      >
        📄 ResumeBuilder
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ textAlign: "center" }}>
              <ListItemText primary="Logout" sx={{ color: "error.main" }} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <DescriptionIcon
              sx={{
                fontSize: 32,
                mr: 1,
                color: "primary.main",
              }}
            />
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ResumeBuilder
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isBuilderPage && (
                <>
                  <Tooltip title="Save">
                    <IconButton
                      onClick={handleSave}
                      color="inherit"
                      size="large"
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download PDF">
                    <IconButton
                      onClick={handleDownloadPDF}
                      color="inherit"
                      size="large"
                    >
                      <PictureAsPdfIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {isAuthenticated ? (
                <Tooltip title="Logout">
                  <IconButton
                    onClick={handleLogout}
                    color="inherit"
                    size="large"
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
