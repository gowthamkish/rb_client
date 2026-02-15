import React from "react";
import { Box, TextField, Grid } from "@mui/material";
import { useResumeStore } from "../../store/resumeStore";

const PersonalInfoForm: React.FC = () => {
  const resume = useResumeStore((state) => state.resume);
  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  if (!resume) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    updatePersonalInfo({
      ...resume.personalInfo,
      [name]: value,
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={resume.personalInfo.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={resume.personalInfo.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={resume.personalInfo.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={resume.personalInfo.location}
            onChange={handleChange}
            placeholder="New York, NY"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Professional Summary"
            name="professionalSummary"
            value={resume.personalInfo.professionalSummary}
            onChange={handleChange}
            placeholder="Write a brief summary about yourself..."
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoForm;
