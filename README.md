# TaskFlow - MERN Task Tracker

A full-stack task tracker built with React, Node.js, Express.js, and MongoDB. The project is structured with a separate API and Vite frontend, mirroring the organization used in the referenced projects.

## Features

- Create, view, update, and delete tasks
- REST API with Express controllers, routes, models, middleware, and MongoDB config
- Mongoose schema validation plus frontend form validation
- Dynamic React updates without page refresh
- Filtering, sorting, search, priorities, due dates, and completion status
- Responsive UI
- Environment variable support for local and deployed URLs

## Project Structure

```txt
backend/
  config/
  controllers/
  database/
  middlewares/
  models/
  routes/
  app.js
frontend/
  src/
    components/
    services/
    App.jsx
```

## Environment Keys Needed

Backend `backend/.env.development.local`:

```env
PORT=5500
NODE_ENV=development
APP_NAME=TaskFlow API
CLIENT_URL=http://localhost:5173
DB_URI=your_mongodb_connection_string
```

Frontend `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5500/api/v1
```

For deployment, also provide:

```env
CLIENT_URL=https://your-frontend-url
VITE_API_BASE_URL=https://your-backend-url/api/v1
```

If you want to allow more than one frontend origin, separate them with commas:

```env
CLIENT_URL=https://your-frontend-url,http://localhost:5173
```

## Deploy

Recommended quick setup:

- Backend: Render Web Service
- Frontend: Vercel
- Database: MongoDB Atlas

Backend settings on Render:

```txt
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Backend environment variables:

```env
PORT=10000
NODE_ENV=production
APP_NAME=TaskFlow API
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority&appName=Cluster0
```

Frontend settings on Vercel:

```txt
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Frontend environment variable:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api/v1
```

## Run Locally

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Routes

Base URL: `/api/v1/tasks`

- `GET /tasks` - list tasks with optional `status`, `priority`, `search`, `sortBy`, and `order`
- `GET /tasks/:id` - get one task
- `POST /tasks` - create a task
- `PATCH /tasks/:id` - update a task
- `DELETE /tasks/:id` - delete a task
