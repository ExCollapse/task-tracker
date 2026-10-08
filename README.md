# Task Tracker

A simple full-stack web app for managing tasks. You can add tasks with a priority and a due date, edit them, mark them as done, filter them and delete them.

Made as a personal project to practice building a REST API, working with PostgreSQL and connecting it all to a React frontend.

## Tech stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Tests:** Jest, Supertest
- **Other:** Docker, Docker Compose, Git

## Features

- Create, edit, delete tasks
- Priority (low / medium / high) and optional due date
- Mark tasks as done
- Filter: all / active / done
- Overdue tasks are highlighted
- Input validation and error handling on the API

## Running with Docker

You need Docker installed.

```bash
docker compose up --build
```

Then open http://localhost:8080

## Running without Docker (development)

You need Node.js 18+ and Docker (only for the database).

```bash
# 1. start the database
docker compose up -d db

# 2. backend
cd backend
cp .env.example .env
npm install
npm run dev

# 3. frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173 and sends `/api` requests to the backend on port 3000.

## Tests

```bash
cd backend
npm test
```

The tests mock the database, so PostgreSQL is not needed to run them.

## API

| Method | Endpoint                  | Description                                        |
|--------|---------------------------|----------------------------------------------------|
| GET    | /api/health               | Check that the server and database are working     |
| GET    | /api/tasks                | Get all tasks (optional `?completed=true&priority=high`) |
| GET    | /api/tasks/:id            | Get one task                                       |
| POST   | /api/tasks                | Create a task                                      |
| PUT    | /api/tasks/:id            | Update a task                                      |
| PATCH  | /api/tasks/:id/toggle     | Mark a task as done / not done                     |
| DELETE | /api/tasks/:id            | Delete a task                                      |

Example request body for `POST /api/tasks`:

```json
{
  "title": "Finish homework",
  "description": "Databases, lab 3",
  "priority": "high",
  "due_date": "2026-11-20"
}
```

## Project structure

```
task-tracker/
  backend/
    db/init.sql        table definition
    src/               Express app, routes, validation
    tests/             Jest tests
  frontend/
    src/               React components
  docker-compose.yml
```

## Ideas for the future

- User accounts and login
- Categories / tags for tasks
- Pagination and search
