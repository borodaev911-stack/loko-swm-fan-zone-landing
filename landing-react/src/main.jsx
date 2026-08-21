import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../landing/styles.css";
import "./animations.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
