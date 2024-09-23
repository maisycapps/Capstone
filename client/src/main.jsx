import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// if you are seeing duplicate console.logs in your terminal -- <StrictMode> calls useEffects twice when in development mode.

createRoot(document.getElementById("root")).render(
  <StrictMode>  
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
