import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { Experience } from "../../store/resumeStore";
import { useResumeStore } from "../../store/resumeStore";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const ExperienceForm: React.FC = () => {
  const resume = useResumeStore((state) => state.resume);
  const addExperience = useResumeStore((state) => state.addExperience);
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const deleteExperience = useResumeStore((state) => state.deleteExperience);
  const reorderExperience = useResumeStore((state) => state.reorderExperience);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Experience>({
    id: "",
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  });

  if (!resume) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? target.checked : value,
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      startDate: date ? date.toISOString().split("T")[0] : "",
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      endDate: date ? date.toISOString().split("T")[0] : "",
    });
  };

  const handleAddOrUpdate = () => {
    if (!formData.jobTitle || !formData.company) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingId) {
      updateExperience(editingId, formData);
      setEditingId(null);
    } else {
      addExperience({
        ...formData,
        id: uuidv4(),
      });
    }

    setFormData({
      id: "",
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    });
  };

  const handleEdit = (experience: Experience) => {
    setFormData(experience);
    setEditingId(experience.id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      id: "",
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Job Title *"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g., Senior Developer"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Company *"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Tech Company Inc."
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Start Date"
            value={formData.startDate ? new Date(formData.startDate) : null}
            onChange={handleStartDateChange}
            slotProps={{
              textField: { fullWidth: true, InputLabelProps: { shrink: true } },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="End Date"
            value={formData.endDate ? new Date(formData.endDate) : null}
            onChange={handleEndDateChange}
            disabled={formData.currentlyWorking}
            slotProps={{
              textField: { fullWidth: true, InputLabelProps: { shrink: true } },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="currentlyWorking"
                checked={formData.currentlyWorking}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Currently working here"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your responsibilities and achievements..."
            multiline
            rows={4}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={editingId ? <EditIcon /> : <AddIcon />}
              onClick={handleAddOrUpdate}
            >
              {editingId ? "Update Experience" : "Add Experience"}
            </Button>
            {editingId && (
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {resume.experiences.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Experiences ({resume.experiences.length})
          </Typography>
          {resume.experiences.map((exp, index) => (
            <Card
              key={exp.id}
              sx={{ mb: 2 }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(index));
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const from = Number(e.dataTransfer.getData("text/plain"));
                if (!Number.isNaN(from) && from !== index) {
                  reorderExperience(from, index);
                }
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {exp.jobTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.company}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {exp.startDate} -{" "}
                      {exp.currentlyWorking ? "Present" : exp.endDate}
                    </Typography>
                    {exp.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {exp.description}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(exp)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteExperience(exp.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {/* allow dropping on empty space to move item to end */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = Number(e.dataTransfer.getData("text/plain"));
              const to = resume.experiences.length - 1;
              if (!Number.isNaN(from) && from !== to)
                reorderExperience(from, to);
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ExperienceForm;
