import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useResumeStore } from "../../store/resumeStore";

const templates = [
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "creative", name: "Creative" },
  { id: "minimal", name: "Minimal" },
  { id: "ats", name: "ATS-Friendly" },
  { id: "executive", name: "Executive" },
];

const TemplateSelector: React.FC = () => {
  const setSelectedTemplate = useResumeStore((s) => s.setSelectedTemplate);

  return (
    <Box>
      <Grid container spacing={2}>
        {templates.map((t) => (
          <Grid key={t.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ cursor: "pointer" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {t.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  A quick preview of the {t.name} template.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedTemplate(t.id)}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TemplateSelector;
