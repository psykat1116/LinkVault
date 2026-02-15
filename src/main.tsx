import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import MainLayout from "@/components/routes/App.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <MainLayout />
  </StrictMode>,
);
