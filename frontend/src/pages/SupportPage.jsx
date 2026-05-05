// Public support page with contact details and FAQs for users.
import PublicNavbar from "../components/PublicNavbar.jsx";

const SupportPage = () => (
  <>
    <PublicNavbar />

    <div className="page-header">
      <h1>Support Center</h1>
      <p>We&apos;re here to help you</p>
    </div>

    <div className="container public-container">
      <div className="contact">
        <h2>Contact Information</h2>
        <br />
        <p>
          <b>College Contact:</b> +91 836 2447465
        </p>
        <p>
          <b>Email:</b> info@sdmcet.ac.in
        </p>
        <p>
          <b>Website Issues:</b> abhi@gmail.com, sahaj@gmail.com, kushal@gmail.com,
          prateek@gmail.com
        </p>
        <p>
          <b>Address:</b> SDMCET, Dharwad, Karnataka
        </p>
      </div>

      <div className="faq">
        <h2>Frequently Asked Questions</h2>
        <h3>How to register as alumni?</h3>
        <p>You can register through the alumni portal by filling your details.</p>

        <h3>How to participate in events?</h3>
        <p>Events can be accessed through the events section and registration forms.</p>

        <h3>Who can access this platform?</h3>
        <p>Students, alumni, and faculty of SDMCET.</p>
      </div>
    </div>
  </>
);

export default SupportPage;
