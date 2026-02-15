import React from "react";
import { Box, Typography, Chip, Divider, Paper } from "@mui/material";
import { useResumeStore } from "../../store/resumeStore";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ResumePreview: React.FC = () => {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const { personalInfo, experiences, education, skills, selectedTemplate } =
    resume;

  // Template styles
  const templateStyles = {
    classic: {
      headerBg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      headerColor: "white",
      accentColor: "#667eea",
      sectionTitleColor: "#1a1a2e",
    },
    modern: {
      headerBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      headerColor: "white",
      accentColor: "#667eea",
      sectionTitleColor: "#667eea",
    },
    creative: {
      headerBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      headerColor: "white",
      accentColor: "#f5576c",
      sectionTitleColor: "#f5576c",
    },
    minimal: {
      headerBg: "#f8f9fa",
      headerColor: "#1a1a2e",
      accentColor: "#333",
      sectionTitleColor: "#333",
    },
    ats: {
      headerBg: "#ffffff",
      headerColor: "#000000",
      accentColor: "#000000",
      sectionTitleColor: "#000000",
    },
    executive: {
      headerBg: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      headerColor: "white",
      accentColor: "#2c3e50",
      sectionTitleColor: "#2c3e50",
    },
  };

  const currentStyle =
    templateStyles[selectedTemplate as keyof typeof templateStyles] ||
    templateStyles.classic;

  return (
    <Paper
      id="resume-preview"
      elevation={3}
      sx={{
        width: "100%",
        minHeight: 800,
        overflow: "hidden",
        bgcolor: "white",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: currentStyle.headerBg,
          color: currentStyle.headerColor,
          p: 4,
          textAlign:
            selectedTemplate === "minimal" || selectedTemplate === "ats"
              ? "left"
              : "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            letterSpacing: selectedTemplate === "ats" ? 0 : 1,
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent:
              selectedTemplate === "minimal" || selectedTemplate === "ats"
                ? "flex-start"
                : "center",
            mt: 2,
          }}
        >
          {personalInfo.email && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EmailIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{personalInfo.email}</Typography>
            </Box>
          )}
          {personalInfo.phone && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{personalInfo.phone}</Typography>
            </Box>
          )}
          {personalInfo.location && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{personalInfo.location}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        {/* Professional Summary */}
        {personalInfo.professionalSummary && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: currentStyle.sectionTitleColor,
                mb: 1,
                borderBottom:
                  selectedTemplate === "ats" ? "2px solid #000" : "none",
                pb: 0.5,
              }}
            >
              Professional Summary
            </Typography>
            <Divider
              sx={{
                mb: 2,
                display: selectedTemplate === "ats" ? "none" : "block",
              }}
            />
            <Typography
              variant="body2"
              sx={{ lineHeight: 1.8, color: "text.secondary" }}
            >
              {personalInfo.professionalSummary}
            </Typography>
          </Box>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: currentStyle.sectionTitleColor,
                mb: 1,
                borderBottom:
                  selectedTemplate === "ats" ? "2px solid #000" : "none",
                pb: 0.5,
              }}
            >
              Experience
            </Typography>
            <Divider
              sx={{
                mb: 2,
                display: selectedTemplate === "ats" ? "none" : "block",
              }}
            />
            {experiences.map((exp, index) => (
              <Box
                key={exp.id}
                sx={{ mb: index < experiences.length - 1 ? 3 : 0 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.startDate} -{" "}
                    {exp.currentlyWorking ? "Present" : exp.endDate}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: currentStyle.accentColor,
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {exp.company}
                </Typography>
                {exp.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {exp.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: currentStyle.sectionTitleColor,
                mb: 1,
                borderBottom:
                  selectedTemplate === "ats" ? "2px solid #000" : "none",
                pb: 0.5,
              }}
            >
              Education
            </Typography>
            <Divider
              sx={{
                mb: 2,
                display: selectedTemplate === "ats" ? "none" : "block",
              }}
            />
            {education.map((edu, index) => (
              <Box
                key={edu.id}
                sx={{ mb: index < education.length - 1 ? 3 : 0 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {edu.school}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.startDate} - {edu.endDate}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: currentStyle.accentColor, fontWeight: 500 }}
                >
                  {edu.degree}
                  {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                </Typography>
                {edu.grade && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Grade: {edu.grade}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: currentStyle.sectionTitleColor,
                mb: 1,
                borderBottom:
                  selectedTemplate === "ats" ? "2px solid #000" : "none",
                pb: 0.5,
              }}
            >
              Skills
            </Typography>
            <Divider
              sx={{
                mb: 2,
                display: selectedTemplate === "ats" ? "none" : "block",
              }}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {skills.map((skill) => (
                <Chip
                  key={skill.id}
                  label={`${skill.name} (${skill.level})`}
                  size="small"
                  sx={{
                    bgcolor:
                      selectedTemplate === "ats"
                        ? "transparent"
                        : `${currentStyle.accentColor}15`,
                    color:
                      selectedTemplate === "ats"
                        ? "text.primary"
                        : currentStyle.accentColor,
                    border:
                      selectedTemplate === "ats" ? "1px solid #ccc" : "none",
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ResumePreview;
