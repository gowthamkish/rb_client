import React from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";
import { useLoader } from "../../context/loaderContext";

const Loader: React.FC = () => {
  const { loading } = useLoader();

  return (
    <Backdrop
      open={loading}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" size={48} thickness={4} />
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Loading…
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Loader;
