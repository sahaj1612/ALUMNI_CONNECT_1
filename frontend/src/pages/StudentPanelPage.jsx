// Student dashboard page for the frontend. Shows jobs, events, applications,
// registrations, notifications, and the student profile section.
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { api } from "../api/client.js";
import AlertMessage from "../components/AlertMessage.jsx";
import PanelLayout from "../components/PanelLayout.jsx";
import { formatDisplayDate, placeholderImage } from "../components/utils.js";

const links = [
  { id: "dashboard", label: "Dashboard", icon: "fa fa-chart-line" },
  { id: "jobs", label: "View Jobs", icon: "fa fa-briefcase" },
  { id: "events", label: "View Events", icon: "fa fa-calendar" },
  { id: "applied", label: "Applied Jobs", icon: "fa fa-file" },
  { id: "registrations", label: "Event Registrations", icon: "fa fa-ticket" },
  { id: "notifications", label: "Notifications", icon: "fa fa-bell" },
  { id: "profile", label: "Profile", icon: "fa fa-user" },
];

const backendBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
  /\/api$/,
  ""
);

const StudentPanelPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [panelData, setPanelData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);

  const activeSection = searchParams.get("section") || "dashboard";

  const loadPanelData = async () => {
    setLoading(true);
    try {
      // One aggregated payload keeps the React screen in sync with the old PHP page.
      const data = await api.get("/student/panel-data");
      setPanelData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPanelData();
  }, []);

  const appliedJobIds = useMemo(
    () => new Set((panelData?.appliedJobs || []).map((item) => item.job_id)),
    [panelData]
  );

  const registeredEventIds = useMemo(
    () => new Set((panelData?.registeredEvents || []).map((item) => item.event_id)),
    [panelData]
  );

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleSectionChange = (section) => {
    setSearchParams({ section });
  };

  const handleApply = async (jobId) => {
    try {
      const data = await api.post(`/student/jobs/${jobId}/apply`, {});
      showMessage(data.message);
      setSearchParams({ section: "jobs" });
      await loadPanelData();
    } catch (error) {
      showMessage(error.message, "warning");
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const data = await api.post(`/student/events/${eventId}/register`, {});
      showMessage(data.message);
      setSearchParams({ section: "events" });
      await loadPanelData();
    } catch (error) {
      showMessage(error.message, "warning");
    }
  };

  const handleMarkRead = async () => {
    const data = await api.post("/student/notifications/mark-read", {});
    showMessage(data.message);
    await loadPanelData();
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    // FormData is required here because profile updates can include files.
    const formData = new FormData(event.currentTarget);
    const data = await api.put("/student/profile", formData);
    showMessage(data.message);
    await loadPanelData();
  };

  if (loading) {
    return <div className="app-loading">Loading student panel...</div>;
  }

  const { profile, counts, jobs, events, appliedJobs, registeredEvents, notifications } =
    panelData;

  return (
    <PanelLayout
      title="Student Panel"
      links={links}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      <AlertMessage message={message} type={messageType} />

      <div id="dashboard" className={`section ${activeSection === "dashboard" ? "active" : ""}`}>
        <h3 className="mb-4">Dashboard</h3>
        <div className="row">
          <div className="col-md-4"><div className="card-box"><i className="fa fa-briefcase fa-3x text-primary"></i><h2>{counts.availableJobs}</h2><p>Available Jobs</p></div></div>
          <div className="col-md-4"><div className="card-box"><i className="fa fa-calendar fa-3x text-success"></i><h2>{counts.upcomingEvents}</h2><p>Upcoming Events</p></div></div>
          <div className="col-md-4"><div className="card-box"><i className="fa fa-file fa-3x text-danger"></i><h2>{counts.appliedJobs}</h2><p>Applied Jobs</p></div></div>
          <div className="col-md-4 mt-4"><div className="card-box"><i className="fa fa-ticket fa-3x text-warning"></i><h2>{counts.registeredEvents}</h2><p>Registered Events</p></div></div>
          <div className="col-md-4 mt-4"><div className="card-box"><i className="fa fa-bell fa-3x text-info"></i><h2>{counts.unreadNotifications}</h2><p>Unread Notifications</p></div></div>
        </div>
      </div>

      <div id="jobs" className={`section ${activeSection === "jobs" ? "active" : ""}`}>
        <h3 className="mb-4">Jobs List</h3>
        <div className="table-card">
          <table className="table table-bordered bg-white mb-0">
            <thead className="table-dark"><tr><th>#</th><th>Company</th><th>Role</th><th>Department</th><th>Salary</th><th>Location</th><th>Action</th></tr></thead>
            <tbody>
              {!jobs.length ? (
                <tr><td colSpan="7" className="text-center py-4">No jobs are available right now.</td></tr>
              ) : (
                jobs.map((job, index) => (
                  <tr key={job.id}>
                    <td>{index + 1}</td><td>{job.company || ""}</td><td>{job.role || ""}</td><td>{job.department || "All Departments"}</td><td>{job.salary || "Not specified"}</td><td>{job.location || "Not specified"}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Link to={`/details/job/${job.id}?panel=student&section=jobs`} className="btn btn-outline-primary btn-sm">View</Link>
                        {appliedJobIds.has(job.id) ? <button className="btn btn-secondary btn-sm" disabled>Applied</button> : <button className="btn btn-primary btn-sm" onClick={() => handleApply(job.id)}>Apply</button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div id="events" className={`section ${activeSection === "events" ? "active" : ""}`}>
        <h3 className="mb-4">Events</h3>
        <div className="table-card">
          <table className="table table-bordered bg-white mb-0">
            <thead className="table-dark"><tr><th>#</th><th>Event</th><th>Date</th><th>Location</th><th>Action</th></tr></thead>
            <tbody>
              {!events.length ? (
                <tr><td colSpan="5" className="text-center py-4">No events have been posted yet.</td></tr>
              ) : (
                events.map((eventItem, index) => (
                  <tr key={eventItem.id}>
                    <td>{index + 1}</td><td>{eventItem.title || ""}</td><td>{formatDisplayDate(eventItem.date)}</td><td>{eventItem.location || "Not specified"}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Link to={`/details/event/${eventItem.id}?panel=student&section=events`} className="btn btn-outline-success btn-sm">View</Link>
                        {registeredEventIds.has(eventItem.id) ? <button className="btn btn-secondary btn-sm" disabled>Registered</button> : <button className="btn btn-success btn-sm" onClick={() => handleRegister(eventItem.id)}>Register</button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div id="applied" className={`section ${activeSection === "applied" ? "active" : ""}`}>
        <h3 className="mb-4">Applied Jobs</h3>
        <div className="table-card">
          <table className="table table-bordered bg-white mb-0">
            <thead className="table-dark"><tr><th>#</th><th>Company</th><th>Role</th><th>Status</th><th>Applied On</th><th>Resume</th></tr></thead>
            <tbody>
              {!appliedJobs.length ? (
                <tr><td colSpan="6" className="text-center py-4">You have not applied for any jobs yet.</td></tr>
              ) : (
                appliedJobs.map((application, index) => (
                  <tr key={application.id}>
                    <td>{index + 1}</td><td>{application.company || ""}</td><td>{application.role || ""}</td><td><span className="badge text-bg-info">{application.status || "Applied"}</span></td><td>{formatDisplayDate(application.applied_at, true)}</td>
                    <td>{application.resume_path ? <a href={`${backendBaseUrl}${application.resume_path}`} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">View</a> : <span className="small-muted">Not uploaded</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div id="registrations" className={`section ${activeSection === "registrations" ? "active" : ""}`}>
        <h3 className="mb-4">Event Registrations</h3>
        <div className="table-card">
          <table className="table table-bordered bg-white mb-0">
            <thead className="table-dark"><tr><th>#</th><th>Event</th><th>Date</th><th>Location</th><th>Status</th><th>Registered On</th></tr></thead>
            <tbody>
              {!registeredEvents.length ? (
                <tr><td colSpan="6" className="text-center py-4">You have not registered for any events yet.</td></tr>
              ) : (
                registeredEvents.map((registration, index) => (
                  <tr key={registration.id}>
                    <td>{index + 1}</td><td>{registration.event_title || ""}</td><td>{formatDisplayDate(registration.event_date)}</td><td>{registration.location || ""}</td><td><span className="badge text-bg-success">{registration.status || "Registered"}</span></td><td>{formatDisplayDate(registration.registered_at, true)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div id="notifications" className={`section ${activeSection === "notifications" ? "active" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Notifications</h3>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleMarkRead}>Mark All Read</button>
        </div>
        {!notifications.length ? (
          <div className="notification-card"><p className="mb-0 small-muted">No notifications yet.</p></div>
        ) : (
          notifications.map((notification) => (
            <div className="notification-card mb-3" key={notification.id}>
              <div className="d-flex justify-content-between gap-3">
                <div>
                  <h5 className="mb-1">{notification.title || "Notification"}</h5>
                  <p className="mb-2">{notification.message || ""}</p>
                  <div className="small-muted">{formatDisplayDate(notification.created_at, true)}</div>
                </div>
                {notification.link ? <Link to={notification.link} className="btn btn-outline-secondary btn-sm align-self-start">Open</Link> : null}
              </div>
            </div>
          ))
        )}
      </div>

      <div id="profile" className={`section ${activeSection === "profile" ? "active" : ""}`}>
        <h3 className="mb-4">My Profile</h3>
        <div className="profile-card">
          <form onSubmit={handleProfileUpdate} className="w-100">
            <div className="profile-layout">
              <div className="profile-side">
                <img src={profile.profile_photo ? `${backendBaseUrl}${profile.profile_photo}` : placeholderImage} className="profile-img" />
                <label className="form-label mt-3">Profile Photo</label>
                <input type="file" name="profile_photo" className="form-control mb-3" />
                <label className="form-label">Resume</label>
                <input type="file" name="resume" className="form-control" />
                {profile.resume_path ? <a href={`${backendBaseUrl}${profile.resume_path}`} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm mt-2">Current Resume</a> : null}
              </div>
              <div className="profile-main">
                <div className="row">
                  <div className="col-md-6 mb-3"><label className="form-label">Name</label><input type="text" name="name" className="form-control" defaultValue={profile.name || ""} /></div>
                  <div className="col-md-6 mb-3"><label className="form-label">Email</label><input type="text" className="form-control" value={profile.email || ""} readOnly /></div>
                  <div className="col-md-6 mb-3"><label className="form-label">Phone</label><input type="text" name="phone" className="form-control" defaultValue={profile.phone || ""} /></div>
                  <div className="col-md-6 mb-3"><label className="form-label">Department</label><input type="text" name="dept" className="form-control" defaultValue={profile.department || ""} /></div>
                  <div className="col-md-6 mb-3"><label className="form-label">Batch</label><input type="text" name="batch" className="form-control" defaultValue={profile.batch || ""} /></div>
                  <div className="col-md-6 mb-3"><label className="form-label">Skills</label><input type="text" name="skills" className="form-control" defaultValue={profile.skills || ""} /></div>
                </div>
                <button className="btn btn-primary" type="submit">Save Profile</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PanelLayout>
  );
};

export default StudentPanelPage;
