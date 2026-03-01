import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for now; replace with remote logging if desired
    console.error("Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ py: 8 }}>
          <Box
            sx={{
              textAlign: "center",
              bgcolor: "background.paper",
              p: 6,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              An unexpected error occurred. You can try refreshing the page or
              return to the home screen.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
              <Button variant="outlined" component={RouterLink} to="/">
                Home
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
