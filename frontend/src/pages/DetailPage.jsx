// Detail page that shows a single job or event record.
// Reads type and id from the route and renders the appropriate view.
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { api } from "../api/client.js";
import { formatDisplayDate } from "../components/utils.js";

const DetailPage = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await api.get(`/details/${type}/${id}`);
        setDetail(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadDetail();
  }, [type, id]);

  const section = searchParams.get("section") || (type === "event" ? "events" : "jobs");
  const panel = searchParams.get("panel") || "student";
  const backUrl = panel === "alumni" ? `/alumni-panel?section=${section}` : `/student-panel?section=${section}`;
  const pageTitle = type === "event" ? "Event Details" : "Job Details";
  const record = detail?.record;

  return (
    <div className="page-shell">
      <div className="details-card">
        <div className="details-header">
          <div className="badge-soft">{type === "event" ? "Event Preview" : "Job Preview"}</div>
          <h1 className="mt-3 mb-0">{pageTitle}</h1>
        </div>
        <div className="details-body">
          {error || !record ? (
            <>
              <div className="alert alert-danger mb-0">
                {error || `The requested ${type} could not be found.`}
              </div>
              <div className="actions">
                <Link to={backUrl} className="btn btn-primary">
                  Back
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="summary-title">
                {type === "event" ? record.title || "Untitled Event" : record.role || "Untitled Job"}
              </h2>
              <p className="summary-text">
                {type === "event"
                  ? `Hosted by ${record.posted_by || "Alumni"}`
                  : `${record.company || "Company not specified"} posted by ${record.posted_by || "Alumni"}`}
              </p>

              <div className="info-grid">
                {type === "job" ? (
                  <>
                    <div className="info-block"><div className="info-label">Company</div><div className="info-value">{record.company || "Not specified"}</div></div>
                    <div className="info-block"><div className="info-label">Department</div><div className="info-value">{record.department || "All Departments"}</div></div>
                    <div className="info-block"><div className="info-label">Salary</div><div className="info-value">{record.salary || "Not specified"}</div></div>
                    <div className="info-block"><div className="info-label">Location</div><div className="info-value">{record.location || "Not specified"}</div></div>
                    <div className="info-block"><div className="info-label">Eligibility</div><div className="info-value">{record.eligibility || "Not specified"}</div></div>
                    <div className="info-block"><div className="info-label">Posted On</div><div className="info-value">{formatDisplayDate(record.created_at)}</div></div>
                  </>
                ) : (
                  <>
                    <div className="info-block"><div className="info-label">Date</div><div className="info-value">{formatDisplayDate(record.date)}</div></div>
                    <div className="info-block"><div className="info-label">Location</div><div className="info-value">{record.location || "Not specified"}</div></div>
                    <div className="info-block"><div className="info-label">Hosted By</div><div className="info-value">{record.posted_by || "Alumni"}</div></div>
                  </>
                )}
              </div>

              <div className="description-card">
                <h2>{type === "event" ? "About This Event" : "Job Description"}</h2>
                <p>{record.description || "No description provided yet."}</p>
              </div>

              <div className="actions">
                <Link to={backUrl} className="btn btn-primary">
                  Back to {type === "event" ? "Events" : "Jobs"}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
