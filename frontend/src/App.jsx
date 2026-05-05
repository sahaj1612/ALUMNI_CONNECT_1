// Main React router configuration for AlumniConnect frontend.
// Defines public pages, protected student and alumni panel routes, and detail pages.
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AlumniInfoPage from "./pages/AlumniInfoPage.jsx";
import EventsInfoPage from "./pages/EventsInfoPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import StudentPanelPage from "./pages/StudentPanelPage.jsx";
import AlumniPanelPage from "./pages/AlumniPanelPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";

const ProtectedRoute = ({ role, children }) => {
  const { loading, authenticated, userType } = useAuth();

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!authenticated || userType !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/alumni" element={<AlumniInfoPage />} />
    <Route path="/events" element={<EventsInfoPage />} />
    <Route path="/support" element={<SupportPage />} />
    <Route
      path="/student-panel"
      element={
        <ProtectedRoute role="student">
          <StudentPanelPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/alumni-panel"
      element={
        <ProtectedRoute role="alumni">
          <AlumniPanelPage />
        </ProtectedRoute>
      }
    />
    <Route path="/details/:type/:id" element={<DetailPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
