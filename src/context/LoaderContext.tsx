import React, { useState, useCallback } from "react";
import LoaderContext from "./loaderContext";

/**
 * Tracks the number of in-flight API requests.
 * `loading` is true whenever at least one request is active.
 */
export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [count, setCount] = useState(0);

  const showLoader = useCallback(() => setCount((c) => c + 1), []);
  const hideLoader = useCallback(() => setCount((c) => Math.max(c - 1, 0)), []);

  return (
    <LoaderContext.Provider
      value={{ loading: count > 0, showLoader, hideLoader }}
    >
      {children}
    </LoaderContext.Provider>
  );
};
