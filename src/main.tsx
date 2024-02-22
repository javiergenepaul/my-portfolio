import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MainContainerProvider } from "./providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainContainerProvider>
      <App />
    </MainContainerProvider>
  </React.StrictMode>
);
