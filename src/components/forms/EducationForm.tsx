import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useResumeStore } from "../../store/resumeStore";
import type { Education } from "../../store/resumeStore";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const EducationForm: React.FC = () => {
  const resume = useResumeStore((state) => state.resume);
  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const deleteEducation = useResumeStore((state) => state.deleteEducation);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>({
    id: "",
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
  });

  if (!resume) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (
    name: "startDate" | "endDate",
    date: Date | null,
  ) => {
    setFormData({
      ...formData,
      [name]: date ? date.toISOString().split("T")[0] : "",
    });
  };

  const handleAddOrUpdate = () => {
    if (!formData.school || !formData.degree) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingId) {
      updateEducation(editingId, formData);
      setEditingId(null);
    } else {
      addEducation({
        ...formData,
        id: uuidv4(),
      });
    }

    setFormData({
      id: "",
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
    });
  };

  const handleEdit = (education: Education) => {
    setFormData(education);
    setEditingId(education.id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      id: "",
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="School/University *"
            name="school"
            value={formData.school}
            onChange={handleChange}
            placeholder="e.g., Stanford University"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Degree *"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="e.g., Bachelor of Science"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Field of Study"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            placeholder="e.g., Computer Science"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Grade (Optional)"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="e.g., 3.8/4.0"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Start Date"
            value={formData.startDate ? new Date(formData.startDate) : null}
            onChange={(date) => handleDateChange("startDate", date)}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="End Date"
            value={formData.endDate ? new Date(formData.endDate) : null}
            onChange={(date) => handleDateChange("endDate", date)}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={editingId ? <EditIcon /> : <AddIcon />}
              onClick={handleAddOrUpdate}
            >
              {editingId ? "Update Education" : "Add Education"}
            </Button>
            {editingId && (
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {resume.education.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Education ({resume.education.length})
          </Typography>
          {resume.education.map((edu) => (
            <Card key={edu.id} sx={{ mb: 2 }}>
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
                      {edu.school}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.degree}
                      {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {edu.startDate} - {edu.endDate}
                    </Typography>
                    {edu.grade && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Grade: {edu.grade}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(edu)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteEducation(edu.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EducationForm;
