// API client helper used by the frontend to call the backend server.
// Adds credentials to every request and throws on failed responses.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload.message || "Something went wrong.";
    throw new Error(message);
  }

  return payload;
};

export const api = {
  get: (path) => request(path),
  post: (path, body, extraOptions = {}) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers:
        body instanceof FormData
          ? undefined
          : {
              "Content-Type": "application/json",
            },
      ...extraOptions,
    }),
  put: (path, body) =>
    request(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers:
        body instanceof FormData
          ? undefined
          : {
              "Content-Type": "application/json",
            },
    }),
  patch: (path, body) =>
    request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }),
  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),
};
