import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import toast from "react-hot-toast";
import { useResumeStore } from "../../store/resumeStore";
import PersonalInfoForm from "../../components/forms/PersonalInfoForm";
import ExperienceForm from "../../components/forms/ExperienceForm";
import EducationForm from "../../components/forms/EducationForm";
import SkillsForm from "../../components/forms/SkillsForm";
import TemplateSelector from "../../components/common/TemplateSelector";
import ResumePreview from "../../components/common/ResumePreview";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import BuildIcon from "@mui/icons-material/Build";
import PaletteIcon from "@mui/icons-material/Palette";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`builder-tabpanel-${index}`}
      aria-labelledby={`builder-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ResumeBuilder: React.FC = () => {
  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);
  const [activeTab, setActiveTab] = useState(0);
  const [showPreview] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const ext = file.name.split(".").pop()?.toLowerCase();

    const parseTextToResume = (text: string) => {
      // simple heuristics: extract email, phone, and name
      const emailMatch = text.match(
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
      );
      const phoneMatch = text.match(/(\+?\d[\d\s\-().]{6,}\d)/);

      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      let fullName = "";
      for (const line of lines.slice(0, 8)) {
        if (emailMatch && line.includes(emailMatch[0])) continue;
        if (phoneMatch && line.includes(phoneMatch[0])) continue;
        if (/^[A-Za-z ,.'-]{2,}$/.test(line) && line.split(" ").length <= 4) {
          fullName = line;
          break;
        }
      }

      let professionalSummary = "";
      const summaryIndex = lines.findIndex((l) =>
        /summary|profile|professional summary/i.test(l),
      );
      if (summaryIndex >= 0) {
        professionalSummary = lines
          .slice(summaryIndex + 1, summaryIndex + 5)
          .join(" ");
      }

      setResume({
        id: resume?.id || "",
        title: resume?.title || "Imported Resume",
        personalInfo: {
          fullName: fullName || resume?.personalInfo.fullName || "",
          email: emailMatch?.[0] || resume?.personalInfo.email || "",
          phone: phoneMatch?.[0] || resume?.personalInfo.phone || "",
          location: resume?.personalInfo.location || "",
          professionalSummary:
            professionalSummary ||
            resume?.personalInfo.professionalSummary ||
            "",
        },
        experiences: resume?.experiences || [],
        education: resume?.education || [],
        skills: resume?.skills || [],
        selectedTemplate: resume?.selectedTemplate || "classic",
        createdAt: resume?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Resume prefilled from uploaded file (best-effort)");
    };

    if (ext === "docx") {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const mammoth = await import("mammoth");
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const text = result.value.replace(/<[^>]+>/g, "\n");
          parseTextToResume(text);
        } catch (err) {
          console.error(err);
          toast.error("Failed to parse .docx file (install mammoth)");
        }
      };
      reader.onerror = () => toast.error("Failed reading file");
      reader.readAsArrayBuffer(file);
      return;
    }

    if (ext === "pdf") {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
          // set workerSrc to CDN using the library version
          try {
            pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
          } catch (e) {
            console.warn("pdfjs worker setup failed", e);
          }

          const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
          const doc = await loadingTask.promise;
          let fullText = "";
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const items = content.items as Array<{ str: string }>;
            fullText += items.map((s) => s.str).join(" ") + "\n";
          }
          parseTextToResume(fullText);
        } catch (err) {
          console.error(err);
          toast.error("Failed to parse PDF (install pdfjs-dist)");
        }
      };
      reader.onerror = () => toast.error("Failed reading file");
      reader.readAsArrayBuffer(file);
      return;
    }

    // .doc (old binary) is not supported client-side reliably
    toast.error("Unsupported file type. Please upload a .docx or .pdf file.");
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

  const tabs = [
    { label: "Personal Info", icon: <PersonIcon /> },
    { label: "Experience", icon: <WorkIcon /> },
    { label: "Education", icon: <SchoolIcon /> },
    { label: "Skills", icon: <BuildIcon /> },
    { label: "Template", icon: <PaletteIcon /> },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Preview Section */}
          {showPreview && (
            <Grid size={{ xs: 12, lg: 6 }}>
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
                    <Button variant="outlined" component="label">
                      Upload Resume
                      <input
                        hidden
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        type="file"
                        onChange={(e) => handleFiles(e.target.files)}
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
            </Grid>
          )}

          {/* Form Section */}
          <Grid size={{ xs: 12, lg: showPreview ? 6 : 12 }}>
            <Paper sx={{ p: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  mb: 2,
                  "& .MuiTab-root": {
                    minHeight: 64,
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    icon={tab.icon}
                    label={tab.label}
                    iconPosition="start"
                    sx={{ gap: 1 }}
                  />
                ))}
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <PersonalInfoForm />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <ExperienceForm />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <EducationForm />
              </TabPanel>
              <TabPanel value={activeTab} index={3}>
                <SkillsForm />
              </TabPanel>
              <TabPanel value={activeTab} index={4}>
                <TemplateSelector />
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResumeBuilder;
