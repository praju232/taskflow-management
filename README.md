# TaskFlow — Task Management Application

A full-stack task management application with JWT authentication, CRUD operations, filtering, search, and a modern responsive dashboard.

## Project Overview

TaskFlow helps users register, log in, and manage personal tasks with statuses (Pending, In Progress, Completed). Each user only sees and manages their own tasks. The app includes dashboard statistics, dark mode, toast notifications, and a clean Tailwind UI.

## Features

- User registration and login with JWT authentication
- Protected routes and persistent sessions via localStorage
- Full task CRUD (Create, Read, Update, Delete)
- Task status management (Pending, In Progress, Completed)
- Filter tasks by status
- Search tasks by title
- Dashboard statistics cards (total, pending, in progress, completed)
- Tasks sorted newest first
- Dark mode toggle
- Responsive design (desktop, tablet, mobile)
- Toast notifications for all major actions
- Loading spinners and empty states

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Context API (Auth, Theme, Toast)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- cors

## Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### Backend

```bash
cd server
npm install
```

Copy the environment file and update values:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

### Server (`server/.env`)

| Variable    | Description                          |
|-------------|--------------------------------------|
| `PORT`      | Server port (default: 5000)          |
| `MONGO_URI` | MongoDB connection string            |
| `JWT_SECRET`| Secret key for signing JWT tokens    |

### Client (`client/.env`)

| Variable       | Description                              |
|----------------|------------------------------------------|
| `VITE_API_URL` | API base URL (default: `/api` via proxy) |

## Folder Structure

```
task-manager/
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth, Theme, Toast contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Login, Register, Dashboard
│   │   ├── services/       # Axios API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/
    ├── config/             # Database connection
    ├── controllers/        # Route handlers
    ├── middleware/         # Auth & error handling
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    ├── server.js           # Entry point
    └── package.json
```

## API Endpoints

### Authentication

| Method | Endpoint              | Description        | Auth |
|--------|-----------------------|--------------------|------|
| POST   | `/api/auth/register`  | Register new user  | No   |
| POST   | `/api/auth/login`     | Login and get JWT  | No   |

### Tasks (Protected)

| Method | Endpoint           | Description              | Auth |
|--------|--------------------|--------------------------|------|
| GET    | `/api/tasks`       | Get user's tasks         | Yes  |
| GET    | `/api/tasks?status=Pending` | Filter by status | Yes  |
| GET    | `/api/tasks?search=title`   | Search by title  | Yes  |
| POST   | `/api/tasks`       | Create a task            | Yes  |
| PUT    | `/api/tasks/:id`   | Update own task          | Yes  |
| DELETE | `/api/tasks/:id`   | Delete own task          | Yes  |

### Health Check

| Method | Endpoint       | Description    |
|--------|----------------|----------------|
| GET    | `/api/health`  | API status     |

## Screenshots

<!-- Add screenshots here -->
<!-- ![Dashboard](./screenshots/dashboard.png) -->
<!-- ![Login](./screenshots/login.png) -->
<!-- ![Dark Mode](./screenshots/dark-mode.png) -->

## Future Improvements

- Drag-and-drop task reordering
- Due dates and reminders
- Task categories and tags
- Team collaboration and shared boards
- Email notifications
- File attachments on tasks
- Pagination for large task lists
- OAuth social login (Google, GitHub)
- Unit and integration tests
- Docker deployment setup

## License

ISC
