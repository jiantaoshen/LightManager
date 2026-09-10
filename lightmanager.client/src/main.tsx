/**
 * File: main.tsx
 * Purpose: Boots the React application, applies global styles, and provides authentication context.
 * Functions: none; this file contains the application entry-point render call.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
