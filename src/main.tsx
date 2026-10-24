import "./styles/fonts.ts";
import "./styles/studio.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./studio/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
