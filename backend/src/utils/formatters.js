// Shared formatter utilities for serializing MongoDB documents,
// normalizing date values, and building asset URLs for the frontend.
const formatUploadPath = (value) => {
  if (!value) {
    return "";
  }

  return value.startsWith("/") ? value : `/${value.replace(/\\/g, "/")}`;
};

export const normaliseMongoDate = (value) => {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (typeof value?.toISOString === "function") {
    return value.toISOString();
  }

  return String(value);
};

export const formatDateInput = (value) => {
  const parsed = normaliseMongoDate(value);
  if (!parsed) {
    return "";
  }

  const date = new Date(parsed);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString().slice(0, 10);
};

export const formatAssetUrl = (value) => formatUploadPath(value);

const normalisePanelLink = (value) => {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/^\/student(\?|$)/, "/student-panel$1")
    .replace(/^\/alumni(\?|$)/, "/alumni-panel$1");
};

export const serialiseDoc = (doc) => {
  const record = doc?.toObject ? doc.toObject() : doc;

  if (!record) {
    return null;
  }

  return {
    ...record,
    id: String(record._id || ""),
    _id: undefined,
  };
};

export const serialiseNotification = (notification) => {
  const record = serialiseDoc(notification);
  if (!record) {
    return null;
  }

  return {
    ...record,
    created_at: normaliseMongoDate(record.created_at),
    link: normalisePanelLink(record.link),
  };
};

export const serialiseJob = (job) => {
  const record = serialiseDoc(job);
  if (!record) {
    return null;
  }

  return {
    ...record,
    created_at: normaliseMongoDate(record.created_at),
  };
};

export const serialiseEvent = (event) => {
  const record = serialiseDoc(event);
  if (!record) {
    return null;
  }

  return {
    ...record,
    date: normaliseMongoDate(record.date),
    event_date_input: formatDateInput(record.date),
  };
};

export const serialiseApplication = (application) => {
  const record = serialiseDoc(application);
  if (!record) {
    return null;
  }

  return {
    ...record,
    job_id: record.job_id ? String(record.job_id) : "",
    applied_at: normaliseMongoDate(record.applied_at),
    resume_path: formatAssetUrl(record.resume_path),
  };
};

export const serialiseRegistration = (registration) => {
  const record = serialiseDoc(registration);
  if (!record) {
    return null;
  }

  return {
    ...record,
    event_id: record.event_id ? String(record.event_id) : "",
    event_date: normaliseMongoDate(record.event_date),
    registered_at: normaliseMongoDate(record.registered_at),
  };
};

export const serialiseStudent = (student) => {
  const record = serialiseDoc(student);
  if (!record) {
    return null;
  }

  return {
    ...record,
    profile_photo: formatAssetUrl(record.profile_photo),
    resume_path: formatAssetUrl(record.resume_path),
  };
};

export const serialiseAlumni = (alumni) => {
  const record = serialiseDoc(alumni);
  if (!record) {
    return null;
  }

  return {
    ...record,
    profile_photo: formatAssetUrl(record.profile_photo),
  };
};
