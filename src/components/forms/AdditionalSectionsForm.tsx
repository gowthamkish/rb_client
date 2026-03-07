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
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useResumeStore } from "../../store/resumeStore";
import type { Language, SocialLink } from "../../store/resumeStore";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LanguageIcon from "@mui/icons-material/Language";
import LinkIcon from "@mui/icons-material/Link";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

// ── Languages Section ─────────────────────────────────────────────────────────
const LanguagesSection: React.FC = () => {
  const resume = useResumeStore((s) => s.resume);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const deleteLanguage = useResumeStore((s) => s.deleteLanguage);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Language>({
    id: "",
    name: "",
    level: "Intermediate",
  });

  if (!resume) return null;

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    if (editingId) {
      updateLanguage(editingId, formData);
      setEditingId(null);
    } else {
      addLanguage({ ...formData, id: uuidv4() });
    }
    setFormData({ id: "", name: "", level: "Intermediate" });
  };

  const handleEdit = (lang: Language) => {
    setFormData(lang);
    setEditingId(lang.id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ id: "", name: "", level: "Intermediate" });
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
      case "Native":
        return "success";
      case "Fluent":
        return "primary";
      case "Proficient":
        return "info";
      case "Intermediate":
        return "warning";
      case "Basic":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Language *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., English, Tamil, Hindi"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Level</InputLabel>
            <Select
              value={formData.level}
              label="Level"
              onChange={(e: SelectChangeEvent) =>
                setFormData({
                  ...formData,
                  level: e.target.value as Language["level"],
                })
              }
            >
              <MenuItem value="Native">Native</MenuItem>
              <MenuItem value="Fluent">Fluent</MenuItem>
              <MenuItem value="Proficient">Proficient</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Basic">Basic</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={editingId ? <EditIcon /> : <AddIcon />}
              onClick={handleAdd}
              sx={{ minWidth: 0 }}
            >
              {editingId ? "Update" : "Add"}
            </Button>
            {editingId && (
              <Button variant="outlined" size="small" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {(resume.languages || []).length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {(resume.languages || []).map((lang) => (
            <Chip
              key={lang.id}
              label={`${lang.name} (${lang.level})`}
              color={getLevelColor(lang.level)}
              onDelete={() => deleteLanguage(lang.id)}
              onClick={() => handleEdit(lang)}
              deleteIcon={<DeleteIcon />}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// ── Websites & Social Media Section ───────────────────────────────────────────
const SocialLinksSection: React.FC = () => {
  const resume = useResumeStore((s) => s.resume);
  const addSocialLink = useResumeStore((s) => s.addSocialLink);
  const updateSocialLink = useResumeStore((s) => s.updateSocialLink);
  const deleteSocialLink = useResumeStore((s) => s.deleteSocialLink);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SocialLink>({
    id: "",
    title: "",
    url: "",
  });

  if (!resume) return null;

  const handleAdd = () => {
    if (!formData.title.trim() || !formData.url.trim()) return;
    if (editingId) {
      updateSocialLink(editingId, formData);
      setEditingId(null);
    } else {
      addSocialLink({ ...formData, id: uuidv4() });
    }
    setFormData({ id: "", title: "", url: "" });
  };

  const handleEdit = (link: SocialLink) => {
    setFormData(link);
    setEditingId(link.id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ id: "", title: "", url: "" });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Link Title *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., LinkedIn, GitHub, Portfolio"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="URL *"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="e.g., https://linkedin.com/in/username"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={editingId ? <EditIcon /> : <AddIcon />}
              onClick={handleAdd}
              sx={{ minWidth: 0 }}
            >
              {editingId ? "Update" : "Add"}
            </Button>
            {editingId && (
              <Button variant="outlined" size="small" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {(resume.socialLinks || []).length > 0 && (
        <Box sx={{ mt: 2 }}>
          {(resume.socialLinks || []).map((link) => (
            <Box
              key={link.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 1,
                px: 1.5,
                mb: 1,
                bgcolor: "grey.50",
                borderRadius: 1,
              }}
            >
              <LinkIcon fontSize="small" color="action" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {link.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {link.url}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => handleEdit(link)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => deleteSocialLink(link.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// ── Certifications Section ────────────────────────────────────────────────────
const CertificationsSection: React.FC = () => {
  const resume = useResumeStore((s) => s.resume);
  const setCertifications = useResumeStore((s) => s.setCertifications);

  if (!resume) return null;

  return (
    <TextField
      fullWidth
      multiline
      minRows={3}
      maxRows={8}
      label="Certifications & Licenses"
      value={resume.certifications || ""}
      onChange={(e) => setCertifications(e.target.value)}
      placeholder="Enter your certifications and licenses, one per line. e.g.&#10;AWS Certified Solutions Architect – 2024&#10;ISTQB Foundation Level – 2022"
    />
  );
};

// ── Awards & Honors Section ───────────────────────────────────────────────────
const AwardsSection: React.FC = () => {
  const resume = useResumeStore((s) => s.resume);
  const setAwards = useResumeStore((s) => s.setAwards);

  if (!resume) return null;

  return (
    <TextField
      fullWidth
      multiline
      minRows={3}
      maxRows={8}
      label="Awards & Honors"
      value={resume.awards || ""}
      onChange={(e) => setAwards(e.target.value)}
      placeholder="Enter your awards and honors, one per line. e.g.&#10;Employee of the Year – ABC Corp, 2023&#10;Best Innovation Award – Hackathon 2022"
    />
  );
};

// ── Hobbies & Interests Section ───────────────────────────────────────────────
const HobbiesSection: React.FC = () => {
  const resume = useResumeStore((s) => s.resume);
  const addHobby = useResumeStore((s) => s.addHobby);
  const deleteHobby = useResumeStore((s) => s.deleteHobby);

  const [hobbyName, setHobbyName] = useState("");

  if (!resume) return null;

  const handleAdd = () => {
    if (!hobbyName.trim()) return;
    addHobby({ id: uuidv4(), name: hobbyName.trim() });
    setHobbyName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 9 }}>
          <TextField
            fullWidth
            size="small"
            label="Hobby / Interest"
            value={hobbyName}
            onChange={(e) => setHobbyName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Photography, Hiking, Reading"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      {(resume.hobbies || []).length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {(resume.hobbies || []).map((hobby) => (
            <Chip
              key={hobby.id}
              label={hobby.name}
              onDelete={() => deleteHobby(hobby.id)}
              deleteIcon={<DeleteIcon />}
              color="default"
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// ── Main Additional Sections Form ─────────────────────────────────────────────
const AdditionalSectionsForm: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>("languages");

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const sections = [
    {
      id: "languages",
      label: "Languages",
      icon: <LanguageIcon />,
      component: <LanguagesSection />,
    },
    {
      id: "socialLinks",
      label: "Websites & Social Media",
      icon: <LinkIcon />,
      component: <SocialLinksSection />,
    },
    {
      id: "certifications",
      label: "Certifications & Licenses",
      icon: <CardMembershipIcon />,
      component: <CertificationsSection />,
    },
    {
      id: "awards",
      label: "Awards & Honors",
      icon: <EmojiEventsIcon />,
      component: <AwardsSection />,
    },
    {
      id: "hobbies",
      label: "Hobbies & Interests",
      icon: <SportsEsportsIcon />,
      component: <HobbiesSection />,
    },
  ];

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add additional details to make your resume stand out. All sections are
        optional.
      </Typography>
      {sections.map((section) => (
        <Accordion
          key={section.id}
          expanded={expanded === section.id}
          onChange={handleAccordionChange(section.id)}
          disableGutters
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: "8px !important",
            mb: 1.5,
            "&:before": { display: "none" },
            "&.Mui-expanded": {
              borderColor: "primary.main",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              "& .MuiAccordionSummary-content": {
                alignItems: "center",
                gap: 1.5,
              },
            }}
          >
            {section.icon}
            <Typography variant="subtitle1" fontWeight={600}>
              {section.label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider sx={{ mb: 2 }} />
            {section.component}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default AdditionalSectionsForm;
