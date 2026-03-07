import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepButton,
  StepConnector,
  stepConnectorClasses,
  CircularProgress,
} from "@mui/material";
import type { StepIconProps } from "@mui/material/StepIcon";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import { useResumeStore } from "../../store/resumeStore";
import { parseResumeService } from "../../services/api";
import PersonalInfoForm from "../../components/forms/PersonalInfoForm";
import ExperienceForm from "../../components/forms/ExperienceForm";
import EducationForm from "../../components/forms/EducationForm";
import SkillsForm from "../../components/forms/SkillsForm";
import AdditionalSectionsForm from "../../components/forms/AdditionalSectionsForm";
import TemplateSelector from "../../components/common/TemplateSelector";
import ResumePreview from "../../components/common/ResumePreview";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import BuildIcon from "@mui/icons-material/Build";
import PaletteIcon from "@mui/icons-material/Palette";
import ExtensionIcon from "@mui/icons-material/Extension";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// ── Custom stepper connector ──────────────────────────────────────────────────
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
    transition: "background-image 0.3s ease",
  },
}));

// ── Custom step icon root ─────────────────────────────────────────────────────
const CustomStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[300],
  zIndex: 1,
  color: "#fff",
  width: 44,
  height: 44,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  boxShadow: "none",
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    boxShadow: `0 4px 10px 0 ${theme.palette.primary.main}55`,
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    opacity: 0.75,
  }),
  // ensure child svg icons inherit a consistent size
  "& svg": {
    fontSize: 20,
  },
}));

const STEP_ICONS: React.ReactElement[] = [
  <PersonIcon />,
  <WorkIcon />,
  <SchoolIcon />,
  <BuildIcon />,
  <ExtensionIcon />,
  <PaletteIcon />,
];

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;
  return (
    <CustomStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {STEP_ICONS[(icon as number) - 1]}
    </CustomStepIconRoot>
  );
}

const ResumeBuilder: React.FC = () => {
  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx" && ext !== "doc") {
      toast.error(
        "Unsupported file type. Please upload a .pdf, .docx, or .doc file.",
      );
      return;
    }

    setUploading(true);
    try {
      const response = await parseResumeService.parseResume(file);
      const data = response.data;

      // Build updated resume from parsed data
      const personalInfo = {
        fullName:
          data.personalInfo?.fullName || resume?.personalInfo.fullName || "",
        email: data.personalInfo?.email || resume?.personalInfo.email || "",
        phone: data.personalInfo?.phone || resume?.personalInfo.phone || "",
        location:
          data.personalInfo?.location || resume?.personalInfo.location || "",
        professionalSummary:
          data.personalInfo?.professionalSummary ||
          resume?.personalInfo.professionalSummary ||
          "",
      };

      const experiences =
        Array.isArray(data.experiences) && data.experiences.length > 0
          ? data.experiences.map((exp: Record<string, string | boolean>) => ({
              id: exp.id || crypto.randomUUID().slice(0, 8),
              jobTitle: exp.jobTitle || "",
              company: exp.company || "",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "",
              currentlyWorking: Boolean(exp.currentlyWorking),
              description: exp.description || "",
            }))
          : resume?.experiences || [];

      const education =
        Array.isArray(data.education) && data.education.length > 0
          ? data.education.map((edu: Record<string, string>) => ({
              id: edu.id || crypto.randomUUID().slice(0, 8),
              school: edu.school || "",
              degree: edu.degree || "",
              fieldOfStudy: edu.fieldOfStudy || "",
              startDate: edu.startDate || "",
              endDate: edu.endDate || "",
              grade: edu.grade || "",
            }))
          : resume?.education || [];

      const skills =
        Array.isArray(data.skills) && data.skills.length > 0
          ? data.skills.map((skill: Record<string, string>) => ({
              id: skill.id || crypto.randomUUID().slice(0, 8),
              name: skill.name || "",
              level: ([
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert",
              ].includes(skill.level)
                ? skill.level
                : "Intermediate") as
                | "Beginner"
                | "Intermediate"
                | "Advanced"
                | "Expert",
            }))
          : resume?.skills || [];

      // ── Additional sections from parsed data ────────────────────────
      const languages =
        Array.isArray(data.languages) && data.languages.length > 0
          ? data.languages.map((lang: Record<string, string>) => ({
              id: lang.id || crypto.randomUUID().slice(0, 8),
              name: lang.name || "",
              level: ([
                "Native",
                "Fluent",
                "Proficient",
                "Intermediate",
                "Basic",
              ].includes(lang.level)
                ? lang.level
                : "Intermediate") as
                | "Native"
                | "Fluent"
                | "Proficient"
                | "Intermediate"
                | "Basic",
            }))
          : resume?.languages || [];

      const socialLinks = resume?.socialLinks || [];
      const certifications = resume?.certifications || "";
      const awards = resume?.awards || "";
      const hobbies = resume?.hobbies || [];

      setResume({
        id: resume?.id || "",
        title: resume?.title || "Imported Resume",
        personalInfo,
        experiences,
        education,
        skills,
        languages,
        socialLinks,
        certifications,
        awards,
        hobbies,
        selectedTemplate: resume?.selectedTemplate || "classic",
        createdAt: resume?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Resume parsed and pre-filled successfully!");
    } catch (err: unknown) {
      console.error(err);
      const e = err as
        | { response?: { data?: { detail?: string } } }
        | undefined;
      toast.error(
        e?.response?.data?.detail ||
          "Failed to parse resume. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  if (!resume) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const STEPS = [
    "Personal Info",
    "Experience",
    "Education",
    "Skills",
    "Finalize",
    "Template",
  ];

  const STEP_PANELS = [
    <PersonalInfoForm />,
    <ExperienceForm />,
    <EducationForm />,
    <SkillsForm />,
    <AdditionalSectionsForm />,
    <TemplateSelector />,
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {/* Preview Section */}
          {showPreview && (
            <Box sx={{ width: { xs: "100%", lg: "48%" } }}>
              <Paper
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                sx={{
                  p: 3,
                  position: "sticky",
                  top: 80,
                  maxHeight: "calc(100vh - 120px)",
                  overflow: "auto",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    Live Preview
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Button
                      variant="outlined"
                      component="label"
                      disabled={uploading}
                      startIcon={
                        uploading ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : undefined
                      }
                    >
                      {uploading ? "Parsing…" : "Upload Resume"}
                      <input
                        hidden
                        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                        type="file"
                        onChange={(e) => {
                          handleFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    border: dragActive ? "2px dashed" : "1px dashed",
                    borderColor: dragActive ? "primary.main" : "divider",
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                    minHeight: 200,
                  }}
                >
                  <ResumePreview />
                </Box>
              </Paper>
            </Box>
          )}

          {/* Form Section */}
          <Box sx={{ width: { xs: "100%", lg: showPreview ? "48%" : "100%" } }}>
            <Paper sx={{ p: 3 }}>
              {/* ── Custom Horizontal Stepper ── */}
              <Stepper
                alternativeLabel
                activeStep={activeStep}
                connector={<CustomConnector />}
                sx={{ mb: 4 }}
              >
                {STEPS.map((label, index) => (
                  <Step key={label} completed={index < activeStep}>
                    <StepButton onClick={() => setActiveStep(index)}>
                      <Box
                        component="span"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <CustomStepIcon
                          icon={index + 1}
                          active={activeStep === index}
                          completed={index < activeStep}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            fontWeight: activeStep === index ? 700 : 500,
                            color:
                              activeStep === index
                                ? "primary.main"
                                : index < activeStep
                                  ? "primary.light"
                                  : "text.secondary",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    </StepButton>
                  </Step>
                ))}
              </Stepper>

              {/* ── Step content ── */}
              <Box sx={{ py: 2, minHeight: 300 }}>
                {STEP_PANELS[activeStep]}
              </Box>

              {/* ── Navigation buttons ── */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                  pt: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((s) => s - 1)}
                >
                  Back
                </Button>

                <Typography variant="caption" color="text.secondary">
                  Step {activeStep + 1} of {STEPS.length}
                </Typography>

                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  disabled={activeStep === STEPS.length - 1}
                  onClick={() => setActiveStep((s) => s + 1)}
                >
                  Next
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ResumeBuilder;
