// Public home page for the AlumniConnect frontend
// Shows branding, hero section, and login modal
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar.jsx";
import LoginModal from "../components/LoginModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const { authenticated, userType } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrimaryAction = () => {
    if (authenticated) {
      navigate(userType === "alumni" ? "/alumni-panel" : "/student-panel");
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <PublicNavbar />

      <div className="hero">
        <div className="slide slide1"></div>
        <div className="slide slide2"></div>
        <div className="slide slide3"></div>
        <div className="slide slide4"></div>
        <div className="slide slide5"></div>

        <div className="hero-content">
          <h1>SDMCET AlumniConnect</h1>
          <h3>Shaping Engineers with Knowledge, Values, and Innovation</h3>
          <p>
            A dedicated alumni engagement platform for{" "}
            <strong>S.D.M. College of Engineering & Technology, Dharwad</strong>,
            encouraging meaningful conversations between students and alumni to support
            learning, collaboration, and industry readiness.
          </p>
          <div className="hero-actions">
            <button className="hero-login-btn" onClick={handlePrimaryAction}>
              {authenticated ? "Back to Dashboard" : "Login"}
            </button>
          </div>
        </div>
      </div>

      <footer>&copy; 2026 S.D.M. College of Engineering & Technology, Dharwad</footer>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default HomePage;
