// Login modal component for student and alumni authentication.
// Lets the user select a login type and submit credentials.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const initialStudentForm = {
  susn: "",
  semail: "",
  spassword: "",
};

const initialAlumniForm = {
  email: "",
  password: "",
};

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { loginStudent, loginAlumni } = useAuth();
  const [mode, setMode] = useState("choice");
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [alumniForm, setAlumniForm] = useState(initialAlumniForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const closeAndReset = () => {
    setMode("choice");
    setError("");
    onClose();
  };

  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await loginStudent(studentForm);
      closeAndReset();
      navigate("/student-panel");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAlumniSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await loginAlumni(alumniForm);
      closeAndReset();
      navigate("/alumni-panel");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div id="loginModal" className="modal" style={{ display: "flex" }}>
      <div className="modal-box">
        <span className="close" onClick={closeAndReset}>
          &times;
        </span>

        {mode === "choice" && (
          <div id="loginChoice">
            <h2>Welcome to AlumniConnect</h2>
            <p>Select how you want to login</p>
            <button className="select-btn" onClick={() => setMode("student")}>
              Student Login
            </button>
            <button className="select-btn" onClick={() => setMode("alumni")}>
              Alumni Login
            </button>
          </div>
        )}

        {mode === "student" && (
          <div id="studentLogin" className="login-form" style={{ display: "block" }}>
            <h3>Student Login</h3>
            <form onSubmit={handleStudentSubmit}>
              <input
                type="text"
                placeholder="USN"
                required
                value={studentForm.susn}
                onChange={(event) =>
                  setStudentForm((current) => ({ ...current, susn: event.target.value }))
                }
              />
              <input
                type="email"
                placeholder="College Email"
                required
                value={studentForm.semail}
                onChange={(event) =>
                  setStudentForm((current) => ({ ...current, semail: event.target.value }))
                }
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={studentForm.spassword}
                onChange={(event) =>
                  setStudentForm((current) => ({
                    ...current,
                    spassword: event.target.value,
                  }))
                }
              />
              {error && <p className="modal-error">{error}</p>}
              <button className="submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="back" onClick={() => setMode("choice")}>
              Back
            </p>
          </div>
        )}

        {mode === "alumni" && (
          <div id="alumniLogin" className="login-form" style={{ display: "block" }}>
            <h3>Alumni Login</h3>
            <form onSubmit={handleAlumniSubmit}>
              <input
                type="email"
                placeholder="Email"
                required
                value={alumniForm.email}
                onChange={(event) =>
                  setAlumniForm((current) => ({ ...current, email: event.target.value }))
                }
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={alumniForm.password}
                onChange={(event) =>
                  setAlumniForm((current) => ({ ...current, password: event.target.value }))
                }
              />
              {error && <p className="modal-error">{error}</p>}
              <button className="submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="back" onClick={() => setMode("choice")}>
              Back
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
