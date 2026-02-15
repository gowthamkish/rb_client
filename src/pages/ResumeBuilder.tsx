import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
} from "@mui/material";
import { useResumeStore } from "../store/resumeStore";
import PersonalInfoForm from "../components/forms/PersonalInfoForm";
import ExperienceForm from "../components/forms/ExperienceForm";
import EducationForm from "../components/forms/EducationForm";
import SkillsForm from "../components/forms/SkillsForm";
import TemplateSelector from "../components/common/TemplateSelector";
import ResumePreview from "../components/common/ResumePreview";
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
  const [activeTab, setActiveTab] = useState(0);
  const [showPreview] = useState(true);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

          {/* Preview Section */}
          {showPreview && (
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                sx={{
                  p: 3,
                  position: "sticky",
                  top: 80,
                  maxHeight: "calc(100vh - 120px)",
                  overflow: "auto",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                >
                  Live Preview
                </Typography>
                <ResumePreview />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ResumeBuilder;
