// Public navigation bar shown on non-authenticated pages.
// Provides links to about, alumni info, events, and support pages.
import { Link } from "react-router-dom";

const PublicNavbar = () => (
  <div className="navbar">
    <div className="nav-left">
      <Link to="/">
        <img
          src="https://cache.careers360.mobi/media/colleges/social-media/logo/SDM_College_of_Engineering_and_Technology_Logo_.png"
          alt="SDMCET logo"
        />
        <h2>SDMCET AlumniConnect</h2>
      </Link>
    </div>

    <ul className="nav-links-reset">
      <li>
        <Link to="/about">About SDMCET</Link>
      </li>
      <li>
        <Link to="/alumni">Alumni</Link>
      </li>
      <li>
        <Link to="/events">Events</Link>
      </li>
      <li>
        <Link to="/support">Support</Link>
      </li>
    </ul>
  </div>
);

export default PublicNavbar;
