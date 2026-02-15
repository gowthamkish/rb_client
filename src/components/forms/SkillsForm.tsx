import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useResumeStore } from "../../store/resumeStore";
import type { Skill } from "../../store/resumeStore";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SkillsForm: React.FC = () => {
  const resume = useResumeStore((state) => state.resume);
  const addSkill = useResumeStore((state) => state.addSkill);
  const updateSkill = useResumeStore((state) => state.updateSkill);
  const deleteSkill = useResumeStore((state) => state.deleteSkill);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Skill>({
    id: "",
    name: "",
    level: "Intermediate",
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

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      level: e.target.value as Skill["level"],
    });
  };

  const handleAddOrUpdate = () => {
    if (!formData.name) {
      alert("Please enter a skill name");
      return;
    }

    if (editingId) {
      updateSkill(editingId, formData);
      setEditingId(null);
    } else {
      addSkill({
        ...formData,
        id: uuidv4(),
      });
    }

    setFormData({
      id: "",
      name: "",
      level: "Intermediate",
    });
  };

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setEditingId(skill.id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      level: "Intermediate",
    });
  };

  const getLevelColor = (
    level: string,
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (level) {
      case "Expert":
        return "success";
      case "Advanced":
        return "primary";
      case "Intermediate":
        return "info";
      case "Beginner":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Skill Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., React, Python, Leadership"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Proficiency Level</InputLabel>
            <Select
              value={formData.level}
              label="Proficiency Level"
              onChange={handleSelectChange}
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
              <MenuItem value="Expert">Expert</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={editingId ? <EditIcon /> : <AddIcon />}
              onClick={handleAddOrUpdate}
            >
              {editingId ? "Update Skill" : "Add Skill"}
            </Button>
            {editingId && (
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {resume.skills.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Skills ({resume.skills.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {resume.skills.map((skill) => (
              <Chip
                key={skill.id}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{skill.name}</span>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      ({skill.level})
                    </Typography>
                  </Box>
                }
                color={getLevelColor(skill.level)}
                onDelete={() => deleteSkill(skill.id)}
                onClick={() => handleEdit(skill)}
                deleteIcon={<DeleteIcon />}
                sx={{
                  cursor: "pointer",
                  "& .MuiChip-deleteIcon": {
                    color: "inherit",
                    opacity: 0.7,
                    "&:hover": {
                      opacity: 1,
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SkillsForm;
