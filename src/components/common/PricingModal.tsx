import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import toast from "react-hot-toast";
import { subscriptionService } from "../../services/api";
import { useUserStore } from "../../store/userStore";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  /** If provided, shown as the reason for opening the modal */
  lockedTemplateName?: string;
}

const FREE_FEATURES = [
  "3 free templates (Classic, Modern, ATS)",
  "Unlimited resumes",
  "PDF download",
  "Live preview",
  "Resume import (PDF / DOCX)",
];

const PREMIUM_FEATURES = [
  "All 9 premium templates",
  "Creative, Minimal, Executive, Sleek, Colorful & Timeline",
  "Unlimited resumes",
  "PDF download",
  "Live preview",
  "Resume import (PDF / DOCX)",
  "Priority support",
  "New templates as they launch",
];

const PricingModal: React.FC<PricingModalProps> = ({
  open,
  onClose,
  lockedTemplateName,
}) => {
  const [loading, setLoading] = useState(false);
  const { user, upgradePlan: setUpgraded } = useUserStore();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please log in to upgrade your plan.");
      return;
    }
    setLoading(true);
    try {
      await subscriptionService.upgradePlan();
      setUpgraded();
      toast.success("🎉 Welcome to Premium! All templates are now unlocked.");
      onClose();
    } catch {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden" },
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}
        size="small"
      >
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          px: 4,
          py: 3,
          color: "white",
          textAlign: "center",
        }}
      >
        <WorkspacePremiumIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
        {lockedTemplateName && (
          <Chip
            label={`${lockedTemplateName} is a Premium template`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              mb: 1,
              display: "block",
              mx: "auto",
              width: "fit-content",
            }}
          />
        )}
        <DialogTitle
          sx={{ p: 0, color: "white", fontSize: "1.6rem", fontWeight: 700 }}
        >
          Upgrade to Premium
        </DialogTitle>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          Unlock all templates and exclusive features
        </Typography>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Plans side-by-side */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          {/* Free Plan */}
          <Box sx={{ p: 3, borderRight: { sm: "1px solid #eee" } }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 0.5, color: "text.secondary" }}
            >
              Free
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 2, color: "text.primary" }}
            >
              $0
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                /mo
              </Typography>
            </Typography>
            <List dense>
              {FREE_FEATURES.map((f) => (
                <ListItem key={f} disableGutters sx={{ py: 0.4 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon
                      sx={{ fontSize: 18, color: "text.disabled" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={f}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Premium Plan */}
          <Box
            sx={{
              p: 3,
              bgcolor: "rgba(102, 126, 234, 0.04)",
              position: "relative",
            }}
          >
            <Chip
              label="POPULAR"
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: "#667eea",
                color: "white",
                fontWeight: 700,
                fontSize: 10,
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 0.5, color: "#667eea" }}
            >
              Premium
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 2, color: "text.primary" }}
            >
              $9.99
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                /mo
              </Typography>
            </Typography>
            <List dense>
              {PREMIUM_FEATURES.map((f) => (
                <ListItem key={f} disableGutters sx={{ py: 0.4 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon sx={{ fontSize: 18, color: "#667eea" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={f}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        <Divider />

        {/* CTA */}
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            onClick={handleUpgrade}
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <WorkspacePremiumIcon />
              )
            }
            sx={{
              py: 1.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd6 0%, #6a3fa0 100%)",
              },
            }}
          >
            {loading ? "Processing…" : "Upgrade to Premium — $9.99/mo"}
          </Button>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Cancel anytime. No hidden fees.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
