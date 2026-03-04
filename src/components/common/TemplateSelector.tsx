import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useResumeStore } from "../../store/resumeStore";
import { useUserStore } from "../../store/userStore";
import PricingModal from "./PricingModal";

interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  isPremium: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: "classic",
    name: "Classic",
    icon: "🎯",
    description: "Professional and timeless",
    isPremium: false,
  },
  {
    id: "modern",
    name: "Modern",
    icon: "✨",
    description: "Contemporary and clean",
    isPremium: false,
  },
  {
    id: "ats",
    name: "ATS-Friendly",
    icon: "✓",
    description: "Optimized for applicant tracking",
    isPremium: false,
  },
  {
    id: "creative",
    name: "Creative",
    icon: "🎨",
    description: "Bold and eye-catching design",
    isPremium: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    icon: "📋",
    description: "Simple and elegant style",
    isPremium: true,
  },
  {
    id: "executive",
    name: "Executive",
    icon: "💼",
    description: "Sophisticated and formal",
    isPremium: true,
  },
  {
    id: "sleek",
    name: "Sleek",
    icon: "🌙",
    description: "Dark and ultra-modern",
    isPremium: true,
  },
  {
    id: "colorful",
    name: "Colorful",
    icon: "🎭",
    description: "Vibrant and expressive",
    isPremium: true,
  },
  {
    id: "timeline",
    name: "Timeline",
    icon: "📅",
    description: "Structured career story",
    isPremium: true,
  },
];

const TemplateSelector: React.FC = () => {
  const setSelectedTemplate = useResumeStore((s) => s.setSelectedTemplate);
  const selectedTemplate = useResumeStore(
    (s) => s.resume?.selectedTemplate ?? "classic",
  );
  const user = useUserStore((s) => s.user);
  const userPlan = user?.plan ?? "free";

  const [pricingOpen, setPricingOpen] = useState(false);
  const [lockedTemplate, setLockedTemplate] = useState<string | undefined>();

  const handleSelect = (t: Template) => {
    if (t.isPremium && userPlan !== "premium") {
      setLockedTemplate(t.name);
      setPricingOpen(true);
      return;
    }
    setSelectedTemplate(t.id);
  };

  return (
    <Box>
      {/* Section header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          Choose a Template
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userPlan === "premium"
            ? "All 9 templates are unlocked for your Premium plan."
            : "3 free templates · Upgrade to unlock 6 premium designs"}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {TEMPLATES.map((t) => {
          const isLocked = t.isPremium && userPlan !== "premium";
          const isSelected = selectedTemplate === t.id;

          return (
            <Grid key={t.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Tooltip
                title={
                  isLocked ? "Upgrade to Premium to unlock this template" : ""
                }
                placement="top"
                arrow
              >
                <Card
                  onClick={() => handleSelect(t)}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    border: isSelected ? "2px solid" : "1px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    boxShadow: isSelected ? 4 : 1,
                    transition: "all 0.2s ease",
                    opacity: isLocked ? 0.75 : 1,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                      opacity: 1,
                    },
                  }}
                >
                  {/* Selected badge */}
                  {isSelected && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "primary.main",
                        fontSize: 20,
                        zIndex: 2,
                      }}
                    />
                  )}

                  {/* Lock overlay for locked premium templates */}
                  {isLocked && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "inherit",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        p: 1,
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      <LockIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                    </Box>
                  )}

                  <CardContent sx={{ pb: "12px !important" }}>
                    {/* Template icon + name row */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{ fontSize: 22, lineHeight: 1 }}
                      >
                        {t.icon}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {t.name}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1.5, fontSize: "0.8rem" }}
                    >
                      {t.description}
                    </Typography>

                    {/* Plan chip */}
                    {t.isPremium ? (
                      <Chip
                        icon={
                          <WorkspacePremiumIcon
                            sx={{ fontSize: "14px !important" }}
                          />
                        }
                        label="Premium"
                        size="small"
                        sx={{
                          bgcolor: isLocked
                            ? "rgba(102,126,234,0.12)"
                            : "rgba(102,126,234,0.18)",
                          color: "#667eea",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          height: 22,
                        }}
                      />
                    ) : (
                      <Chip
                        label="Free"
                        size="small"
                        sx={{
                          bgcolor: "rgba(76,175,80,0.12)",
                          color: "success.dark",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          height: 22,
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>

      <PricingModal
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        lockedTemplateName={lockedTemplate}
      />
    </Box>
  );
};

export default TemplateSelector;
