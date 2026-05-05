// React entrypoint that mounts the application and wraps it in router/auth providers.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/index.css";
import "./styles/student-panel.css";
import "./styles/job-details.css";
import "./styles/public-pages.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
