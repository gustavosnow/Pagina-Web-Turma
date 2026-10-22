import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/press-start-2p/400.css";
import "@fontsource/vt323/400.css";
import "./styles/global.css";
import "./styles/secoes.css";
import "./styles/undertale.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
