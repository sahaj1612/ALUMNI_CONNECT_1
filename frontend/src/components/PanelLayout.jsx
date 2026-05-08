// Shared panel layout used by student and alumni dashboard pages.
// Renders the sidebar, topbar, home navigation, and logout behavior.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PanelLayout = ({
  title,
  links,
  activeSection,
  onSectionChange,
  homeLinkText = "Back to Home",
  children,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <div className="sidebar">
        <h4>{title}</h4>
        {links.map((link) => (
          <a
            key={link.id}
            className={activeSection === link.id ? "active-link" : ""}
            onClick={() => onSectionChange(link.id)}
          >
            <i className={link.icon}></i> {link.label}
          </a>
        ))}
      </div>

      <div className="topbar">
        <span>COLLEGE ALUMNI SYSTEM</span>
        <div className="topbar-actions">
          <Link to="/" className="panel-home-btn">
            {homeLinkText}
          </Link>
          <button type="button" className="panel-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="content">{children}</div>
    </>
  );
};

export default PanelLayout;
