# SDMCET AlumniConnect

AlumniConnect is a full-stack web application for **S.D.M. College of Engineering & Technology, Dharwad**. It brings students and alumni together in one place for career opportunities, events, applications, and ongoing professional engagement.

## Features

- Separate, session-based student and alumni logins
- Student and alumni profile management, including profile-photo uploads
- Alumni job posting and management
- Student job applications with application-status updates
- Alumni event creation and student event registration
- In-app notifications for new jobs, events, registrations, and application updates
- Protected student and alumni dashboards

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | Express sessions with MongoDB session storage |
| File uploads | Multer |

## Prerequisites

- Node.js 20 or later
- npm
- A running MongoDB instance, either local or hosted

## Installation

Clone the repository and install dependencies for both applications:

```bash
git clone https://github.com/sahaj1612/ALUMNI_CONNECT_1.git
cd ALUMNI_CONNECT_1

cd backend
npm install

cd ../frontend
npm install
```

## Environment configuration

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/alumniConnectDB
SESSION_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Optionally, create `frontend/.env` when the API is hosted somewhere other than the local backend:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files or real credentials.

## Run locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The backend health endpoint is available at `http://localhost:5000/api/health`.

## Available scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Run the Express API with Nodemon |
| `backend` | `npm start` | Run the Express API with Node.js |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Create a production frontend build |
| `frontend` | `npm run preview` | Preview the production build locally |

## Project structure

```text
ALUMNI_CONNECT_1/
├── backend/              # Express API, MongoDB models, routes, and middleware
├── frontend/             # React and Vite user interface
├── uploads/              # Locally stored profile photos and resumes
└── README.md
```

## Contributing

1. Fork the repository.
2. Create a focused branch: `git checkout -b feature/your-feature`.
3. Make and test your changes.
4. Open a pull request explaining the change and its purpose.

## License

No license has been added to this repository yet. Add a license before distributing or reusing the code under defined terms.
