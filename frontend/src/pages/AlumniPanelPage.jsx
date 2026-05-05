// Alumni dashboard page for the frontend. Provides job and event posting,
// application status updates, registrations, notifications, and alumni profile editing.
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { api } from "../api/client.js";
import AlertMessage from "../components/AlertMessage.jsx";
import PanelLayout from "../components/PanelLayout.jsx";
import { formatDisplayDate, placeholderImage } from "../components/utils.js";

const links = [
  { id: "dashboard", label: "Dashboard", icon: "fa fa-chart-line" },
  { id: "post-job", label: "Post Job", icon: "fa fa-plus-circle" },
  { id: "jobs", label: "My Jobs", icon: "fa fa-briefcase" },
  { id: "post-event", label: "Post Event", icon: "fa fa-calendar-plus" },
  { id: "events", label: "My Events", icon: "fa fa-calendar" },
  { id: "applications", label: "Job Applications", icon: "fa fa-file-lines" },
  { id: "registrations", label: "Event Registrations", icon: "fa fa-ticket" },
  { id: "notifications", label: "Notifications", icon: "fa fa-bell" },
  { id: "profile", label: "Profile", icon: "fa fa-user" },
];

const emptyJobForm = { company: "", role: "", salary: "", location: "", department: "", eligibility: "", description: "" };
const emptyEventForm = { title: "", event_date: "", location: "", description: "" };
const backendBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

const AlumniPanelPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [panelData, setPanelData] = useState(null);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);

  const activeSection = searchParams.get("section") || "dashboard";
  const editJobId = searchParams.get("editJob") || "";
  const editEventId = searchParams.get("editEvent") || "";

  const editingJob = useMemo(() => panelData?.jobs.find((job) => job.id === editJobId) || null, [panelData, editJobId]);
  const editingEvent = useMemo(() => panelData?.events.find((eventItem) => eventItem.id === editEventId) || null, [panelData, editEventId]);

  const loadPanelData = async () => {
    setLoading(true);
    try {
      // The alumni panel needs multiple related datasets, so the backend returns them together.
      const data = await api.get("/alumni/panel-data");
      setPanelData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPanelData();
  }, []);

  useEffect(() => {
    // Mirror the selected application status locally so the Save button matches the old UI flow.
    const nextDrafts = {};
    (panelData?.applications || []).forEach((application) => {
      nextDrafts[application.id] = application.status || "Applied";
    });
    setStatusDrafts(nextDrafts);
  }, [panelData]);

  useEffect(() => {
    if (editingJob) {
      setJobForm({
        company: editingJob.company || "",
        role: editingJob.role || "",
        salary: editingJob.salary || "",
        location: editingJob.location || "",
        department: editingJob.department || "",
        eligibility: editingJob.eligibility || "",
        description: editingJob.description || "",
      });
    } else {
      setJobForm({ ...emptyJobForm, company: panelData?.profile?.company || "" });
    }
  }, [editingJob, panelData]);

  useEffect(() => {
    if (editingEvent) {
      setEventForm({
        title: editingEvent.title || "",
        event_date: editingEvent.event_date_input || "",
        location: editingEvent.location || "",
        description: editingEvent.description || "",
      });
    } else {
      setEventForm(emptyEventForm);
    }
  }, [editingEvent]);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const setSection = (section, extra = {}) => setSearchParams({ section, ...extra });

  const handleJobSubmit = async (event) => {
    event.preventDefault();
    const data = editingJob ? await api.put(`/alumni/jobs/${editingJob.id}`, jobForm) : await api.post("/alumni/jobs", jobForm);
    showMessage(data.message);
    setSearchParams({ section: "jobs" });
    await loadPanelData();
  };

  const handleEventSubmit = async (event) => {
    event.preventDefault();
    const data = editingEvent ? await api.put(`/alumni/events/${editingEvent.id}`, eventForm) : await api.post("/alumni/events", eventForm);
    showMessage(data.message);
    setSearchParams({ section: "events" });
    await loadPanelData();
  };

  const handleDeleteJob = async (jobId) => {
    const data = await api.delete(`/alumni/jobs/${jobId}`);
    showMessage(data.message);
    await loadPanelData();
  };

  const handleDeleteEvent = async (eventId) => {
    const data = await api.delete(`/alumni/events/${eventId}`);
    showMessage(data.message);
    await loadPanelData();
  };

  const handleStatusUpdate = async (applicationId, status) => {
    const data = await api.patch(`/alumni/applications/${applicationId}/status`, { status });
    showMessage(data.message);
    await loadPanelData();
  };

  const handleMarkRead = async () => {
    const data = await api.post("/alumni/notifications/mark-read", {});
    showMessage(data.message);
    await loadPanelData();
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = await api.put("/alumni/profile", formData);
    showMessage(data.message);
    await loadPanelData();
  };

  if (loading) {
    return <div className="app-loading">Loading alumni panel...</div>;
  }

  const { profile, counts, jobs, events, applications, registrations, notifications } = panelData;

  return (
    <PanelLayout title="Alumni Panel" links={links} activeSection={activeSection} onSectionChange={(section) => setSection(section)}>
      <AlertMessage message={message} type={messageType} />

      <div id="dashboard" className={`section ${activeSection === "dashboard" ? "active" : ""}`}>
        <h3 className="mb-4">Dashboard</h3>
        <div className="row g-4">
          <div className="col-md-4"><div className="card-box"><i className="fa fa-briefcase fa-3x text-primary"></i><h2 className="mt-3">{counts.jobs}</h2><p>Jobs Posted</p></div></div>
          <div className="col-md-4"><div className="card-box"><i className="fa fa-calendar fa-3x text-success"></i><h2 className="mt-3">{counts.events}</h2><p>Events Posted</p></div></div>
          <div className="col-md-4"><div className="card-box"><i className="fa fa-file-lines fa-3x text-danger"></i><h2 className="mt-3">{counts.applications}</h2><p>Applications Received</p></div></div>
          <div className="col-md-4"><div className="card-box"><i className="fa fa-ticket fa-3x text-warning"></i><h2 className="mt-3">{counts.registrations}</h2><p>Event Registrations</p></div></div>
          <div className="col-md-4"><div className="card-box"><i className="fa fa-bell fa-3x text-info"></i><h2 className="mt-3">{counts.unreadNotifications}</h2><p>Unread Notifications</p></div></div>
        </div>
      </div>

      <div id="post-job" className={`section ${activeSection === "post-job" ? "active" : ""}`}>
        <h3 className="mb-4">{editingJob ? "Edit Job" : "Post Job"}</h3>
        <div className="form-card">
          <form onSubmit={handleJobSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3"><label className="form-label">Company</label><input type="text" className="form-control" required value={jobForm.company} onChange={(event) => setJobForm((current) => ({ ...current, company: event.target.value }))} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Role</label><input type="text" className="form-control" required value={jobForm.role} onChange={(event) => setJobForm((current) => ({ ...current, role: event.target.value }))} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Salary</label><input type="text" className="form-control" placeholder="Eg: 6 LPA" value={jobForm.salary} onChange={(event) => setJobForm((current) => ({ ...current, salary: event.target.value }))} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Location</label><input type="text" className="form-control" value={jobForm.location} onChange={(event) => setJobForm((current) => ({ ...current, location: event.target.value }))} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Department</label><input type="text" className="form-control" placeholder="Eg: CSE" value={jobForm.department} onChange={(event) => setJobForm((current) => ({ ...current, department: event.target.value }))} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Eligibility</label><input type="text" className="form-control" placeholder="Eg: 7 CGPA and above" value={jobForm.eligibility} onChange={(event) => setJobForm((current) => ({ ...current, eligibility: event.target.value }))} /></div>
              <div className="col-12 mb-3"><label className="form-label">Description</label><textarea className="form-control" placeholder="Add job details, requirements, and instructions" value={jobForm.description} onChange={(event) => setJobForm((current) => ({ ...current, description: event.target.value }))}></textarea></div>
            </div>
            <button type="submit" className="btn btn-primary">{editingJob ? "Update Job" : "Post Job"}</button>
            {editingJob ? <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => setSection("post-job")}>Cancel</button> : null}
          </form>
        </div>
      </div>

      <div id="jobs" className={`section ${activeSection === "jobs" ? "active" : ""}`}>
        <h3 className="mb-4">My Jobs</h3>
        <div className="table-card">
          <table className="table table-bordered bg-white mb-0">
            <thead className="table-dark"><tr><th>#</th><th>Company</th><th>Role</th><th>Department</th><th>Salary</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>
              {!jobs.length ? (
                <tr><td colSpan="7" className="text-center py-4">No jobs posted yet.</td></tr>
              ) : (
                jobs.map((job, index) => (
                  <tr key={job.id}>
                    <td>{index + 1}</td><td>{job.company || ""}</td><td>{job.role || ""}</td><td>{job.department || "All Departments"}</td><td>{job.salary || "Not specified"}</td><td>{job.location || "Not specified"}</td>
                    <td><div className="d-flex gap-2 flex-wrap"><Link to={`/details/job/${job.id}?panel=alumni&section=jobs`} className="btn btn-outline-primary btn-sm">View</Link><button className="btn btn-outline-secondary btn-sm" onClick={() => setSection("post-job", { editJob: job.id })}>Edit</button><button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteJob(job.id)}>Delete</button></div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div id="post-event" className={`section ${activeSection === "post-event" ? "active" : ""}`}>
        <h3 className="mb-4">{editingEvent ? "Edit Event" : "Post Event"}</h3>
        <div className="form-card">
          <form onSubmit={handleEventSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3"><label className="form-label">Event Title</label><input type="text" className="form-control" required value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Event Date</label><input type="date" className="form-control" required value={eventForm.event_date} onChange={(event) => setEventForm((current) => ({ ...current, event_date: event.target.value }))} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Location</label><input type="text" className="form-control" required value={eventForm.location} onChange={(event) => setEventForm((current) => ({ ...current, location: event.target.value }))} /></div>
              <div className="col-12 mb-3"><label className="form-label">Description</label><textarea className="form-control" placeholder="Describe the event details" value={eventForm.description} onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))}></textarea></div>
            </div>
            <button type="submit" className="btn btn-success">{editingEvent ? "Update Event" : "Post Event"}</button>
            {editingEvent ? <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => setSection("post-event")}>Cancel</button> : null}
          </form>
        </div>
      </div>

      <div id="events" className={`section ${activeSection === "events" ? "active" : ""}`}>
        <h3 className="mb-4">My Events</h3>
        <div className="table-card">
          <table className="table table-bordered bg-white mb-0">
            <thead className="table-dark"><tr><th>#</th><th>Event</th><th>Date</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>
              {!events.length ? (
                <tr><td colSpan="5" className="text-center py-4">No events posted yet.</td></tr>
              ) : (
                events.map((eventItem, index) => (
                  <tr key={eventItem.id}>
                    <td>{index + 1}</td><td>{eventItem.title || ""}</td><td>{formatDisplayDate(eventItem.date)}</td><td>{eventItem.location || ""}</td>
                    <td><div className="d-flex gap-2 flex-wrap"><Link to={`/details/event/${eventItem.id}?panel=alumni&section=events`} className="btn btn-outline-success btn-sm">View</Link><button className="btn btn-outline-secondary btn-sm" onClick={() => setSection("post-event", { editEvent: eventItem.id })}>Edit</button><button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteEvent(eventItem.id)}>Delete</button></div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div id="applications" className={`section ${activeSection === "applications" ? "active" : ""}`}>
        <h3 className="mb-4">Job Applications</h3>
        <div className="table-card">
          <table className="table table-bordered bg-white mb-0">
            <thead className="table-dark"><tr><th>#</th><th>Student</th><th>Email</th><th>Role</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {!applications.length ? (
                <tr><td colSpan="6" className="text-center py-4">No student applications yet.</td></tr>
              ) : (
                applications.map((application, index) => (
                  <tr key={application.id}>
                    <td>{index + 1}</td><td>{application.student_name || application.student_usn || ""}</td><td>{application.student_email || ""}</td><td>{application.role || ""}</td><td>{application.status || "Applied"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <select className="form-select form-select-sm" value={statusDrafts[application.id] || "Applied"} onChange={(event) => setStatusDrafts((current) => ({ ...current, [application.id]: event.target.value }))}>
                          <option value="Applied">Applied</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Selected">Selected</option>
                        </select>
                        <button className="btn btn-sm btn-primary" onClick={() => handleStatusUpdate(application.id, statusDrafts[application.id] || "Applied")}>Save</button>
                      </div>
                    </td>
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
            <thead className="table-dark"><tr><th>#</th><th>Student</th><th>Email</th><th>Event</th><th>Date</th><th>Registered On</th></tr></thead>
            <tbody>
              {!registrations.length ? (
                <tr><td colSpan="6" className="text-center py-4">No student registrations yet.</td></tr>
              ) : (
                registrations.map((registration, index) => (
                  <tr key={registration.id}>
                    <td>{index + 1}</td><td>{registration.student_name || registration.student_usn || ""}</td><td>{registration.student_email || ""}</td><td>{registration.event_title || ""}</td><td>{formatDisplayDate(registration.event_date)}</td><td>{formatDisplayDate(registration.registered_at, true)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div id="notifications" className={`section ${activeSection === "notifications" ? "active" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-4"><h3 className="mb-0">Notifications</h3><button type="button" className="btn btn-outline-primary btn-sm" onClick={handleMarkRead}>Mark All Read</button></div>
        {!notifications.length ? (
          <div className="notification-card"><p className="mb-0 small-muted">No notifications yet.</p></div>
        ) : (
          notifications.map((notification) => (
            <div className="notification-card mb-3" key={notification.id}>
              <div className="d-flex justify-content-between gap-3">
                <div><h5 className="mb-1">{notification.title || "Notification"}</h5><p className="mb-2">{notification.message || ""}</p><div className="small-muted">{formatDisplayDate(notification.created_at, true)}</div></div>
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
                <img src={profile.profile_photo ? `${backendBaseUrl}${profile.profile_photo}` : placeholderImage} alt="Profile photo" />
                <label className="form-label mt-3">Profile Photo</label>
                <input type="file" name="profile_photo" className="form-control" />
              </div>
              <div className="profile-main">
                <div className="mb-3"><label className="form-label">Name</label><input type="text" name="name" className="form-control" defaultValue={profile.name || ""} required /></div>
                <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" value={profile.email || ""} readOnly /></div>
                <div className="mb-3"><label className="form-label">Company</label><input type="text" name="company" className="form-control" defaultValue={profile.company || ""} /></div>
                <div className="mb-3"><label className="form-label">Graduation Year</label><input type="text" name="year" className="form-control" defaultValue={profile.year || ""} /></div>
                <button type="submit" className="btn btn-primary">Save Profile</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PanelLayout>
  );
};

export default AlumniPanelPage;
