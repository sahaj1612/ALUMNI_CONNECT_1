// Public about page with information about the college and its programs.
import PublicNavbar from "../components/PublicNavbar.jsx";

const AboutPage = () => (
  <>
    <PublicNavbar />

    <div className="page-header">
      <h1>About SDMCET</h1>
      <p>Shaping Engineers with Knowledge, Values, and Innovation</p>
    </div>

    <div className="container public-container">
      <div className="section">
        <h2>About the Institution</h2>
        <p>
          S.D.M College of Engineering & Technology (SDMCET), located in Dharwad,
          Karnataka, is a premier engineering institution established with the vision of
          providing quality technical education. The college is known for its strong
          academic culture, experienced faculty, and commitment to innovation and
          excellence.
        </p>
      </div>

      <div className="section">
        <h2>Academic Programs</h2>
        <p>
          SDMCET offers a wide range of undergraduate and postgraduate programs in
          engineering and technology. The curriculum is designed to meet industry
          standards, combining theoretical knowledge with practical application to
          prepare students for real-world challenges.
        </p>
      </div>

      <div className="section">
        <h2>Infrastructure & Facilities</h2>
        <p>
          The campus is equipped with modern infrastructure including well-equipped
          laboratories, a digital library, smart classrooms, and advanced research
          centers. Students have access to all the resources needed for academic and
          personal growth.
        </p>
      </div>

      <div className="section">
        <h2>Placements & Career Growth</h2>
        <p>
          The institution has an active placement cell that connects students with
          leading companies. Many top recruiters visit the campus every year, offering
          excellent career opportunities to students across various domains.
        </p>
      </div>

      <div className="section">
        <h2>Alumni Contribution</h2>
        <p>
          SDMCET alumni are spread across the globe and contribute actively by mentoring
          students, conducting sessions, and supporting institutional development. The
          alumni network plays a vital role in bridging the gap between academics and
          industry.
        </p>
      </div>
    </div>
  </>
);

export default AboutPage;
