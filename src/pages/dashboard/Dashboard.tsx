import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { resumeService } from "../../services/api";
import { useResumeStore } from "../../store/resumeStore";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionIcon from "@mui/icons-material/Description";

interface Resume {
  _id: string;
  title: string;
  selectedTemplate: string;
  updatedAt: string;
  personalInfo?: {
    fullName?: string;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const globalResumes = useResumeStore((state) => state.resumes);

  useEffect(() => {
    // If resumes are already populated in global store (prefetched by App), use them
    if (Array.isArray(globalResumes) && globalResumes.length > 0) {
      setResumes(globalResumes as unknown as Resume[]);
      setLoading(false);
      return;
    }

    loadResumes();
  }, [globalResumes]);

  const loadResumes = async () => {
    try {
      const response = await resumeService.getResumes();
      setResumes(response.data);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    resumeId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedResumeId(resumeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResumeId(null);
  };

  const handleEdit = (resumeId: string) => {
    navigate(`/builder?id=${resumeId}`);
    handleMenuClose();
  };

  const handleDelete = async (resumeId: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await resumeService.deleteResume(resumeId);
        toast.success("Resume deleted successfully");
        loadResumes();
      } catch {
        toast.error("Failed to delete resume");
      }
    }
    handleMenuClose();
  };

  const handleDownload = (resumeId: string) => {
    // Open the resume in the builder where the user can use the download button
    navigate(`/builder?id=${resumeId}`);
    toast("Opened builder — use the PDF icon to download", { icon: "📄" });
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              My Resumes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and create your professional resumes
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate("/builder")}
          >
            Create New Resume
          </Button>
        </Box>

        {resumes.length === 0 ? (
          <Card
            sx={{
              textAlign: "center",
              py: 8,
              px: 4,
            }}
          >
            <DescriptionIcon
              sx={{ fontSize: 80, color: "primary.main", mb: 2, opacity: 0.7 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              No Resumes Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Start creating your first resume to get hired!
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate("/builder")}
            >
              Create Your First Resume
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {resumes.map((resume) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={resume._id}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
                    },
                  }}
                  onClick={() => handleEdit(resume._id)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {resume.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, resume._id);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Chip
                      label={resume.selectedTemplate}
                      color="primary"
                      size="small"
                      sx={{ mb: 2, textTransform: "capitalize" }}
                    />

                    {resume.personalInfo?.fullName && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {resume.personalInfo.fullName}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Last updated:{" "}
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(resume._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(resume._id);
                        }}
                      >
                        PDF
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => selectedResumeId && handleEdit(selectedResumeId)}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => selectedResumeId && handleDownload(selectedResumeId)}
          >
            <ListItemIcon>
              <PictureAsPdfIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download PDF</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => selectedResumeId && handleDelete(selectedResumeId)}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default Dashboard;
