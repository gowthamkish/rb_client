import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { LoaderProvider } from "./context/LoaderContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </ErrorBoundary>
  </StrictMode>,
);
