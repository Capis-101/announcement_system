import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AnnouncementProvider } from "./context/AnnouncementContext";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AnnouncementProvider>
          <App />
        </AnnouncementProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
