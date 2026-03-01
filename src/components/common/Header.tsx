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
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useResumeStore } from "../../store/resumeStore";
import type { Resume } from "../../store/resumeStore";
import { resumeService } from "../../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const resume = useResumeStore((s) => s.resume);

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

    const token = localStorage.getItem("token");
    const resume = useResumeStore.getState().resume as Resume | null;
    const setResume = useResumeStore.getState().setResume;

    if (!resume) {
      toast.error("Nothing to save");
      return;
    }

    if (!token) {
      // fallback to local save
      const saveDraft = useResumeStore.getState().saveDraft;
      if (saveDraft) {
        saveDraft();
        toast.success("Draft saved locally");
        return;
      }
      toast.error("Not authenticated");
      return;
    }

    (async () => {
      try {
        if (resume.id) {
          const res = await resumeService.updateResume(resume.id, resume);
          const updated = res.data?.resume || res.data;
          if (updated) {
            setResume({
              ...resume,
              id: updated._id || updated.id,
              updatedAt: updated.updatedAt || resume.updatedAt,
            });
          }
          toast.success("Resume updated on server");
        } else {
          const res = await resumeService.createResume(resume);
          const created = res.data?.resume || res.data;
          if (created) {
            setResume({
              ...resume,
              id: created._id || created.id,
              createdAt: created.createdAt,
              updatedAt: created.updatedAt,
            });
          }
          toast.success("Resume saved to server");
        }
      } catch (err: unknown) {
        console.error(err);
        const e = err as
          | { response?: { data?: { message?: string } } }
          | undefined;
        toast.error(
          e?.response?.data?.message || "Failed to save resume to server",
        );
      }
    })();
  };

  const handleDownloadPDF = async () => {
    if (onDownloadPDF) {
      onDownloadPDF();
      return;
    }

    if (!resume) {
      toast.error("No resume to download");
      return;
    }

    setDownloadingPDF(true);
    try {
      const el = document.getElementById("resume-preview");
      if (!el) {
        toast.error("Resume preview not found");
        return;
      }

      const canvas = await html2canvas(el as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = imgHeight / imgWidth;
      const imgPdfHeight = ratio * pdfWidth;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgPdfHeight);

      // If content is taller than one page, add pages
      let heightLeft = imgPdfHeight - pdfHeight;
      while (heightLeft > -1) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgPdfHeight);
        heightLeft -= pdfHeight;
      }

      const filename = `${(resume.title || "resume").replace(/\s+/g, "_")}.pdf`;
      pdf.save(filename);
      toast.success(`Downloaded ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloadingPDF(false);
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
                      disabled={downloadingPDF}
                    >
                      {downloadingPDF ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <PictureAsPdfIcon />
                      )}
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
