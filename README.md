# Collaborative Task Manager

A production-ready full-stack task manager application with real-time collaboration features.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS v4, React Query, Supabase Auth (Client).
- **Backend**: Node.js, Express, Socket.io, Supabase (PostgreSQL + Auth).
- **Database**: Supabase PostgreSQL.
- **Language**: TypeScript throughout.

## Architecture

- **Client (`/client`)**:
  - `app/`: Next.js App Router pages (Dashboard, Login, Signup).
  - `components/`: Reusable UI components (Shadcn-like) and Feature components (Task Lists, Forms).
  - `hooks/`: Custom hooks for Auth (`useAuth`), Real-time (`useSocket`), and Data (`useTasks`).
  - `lib/`: Utilities and Supabase client config.

- **Server (`/server`)**:
  - `src/app.ts`: Express app setup.
  - `src/server.ts`: Entry point, HTTP server + Socket.io initialization.
  - `src/controllers/`: Request handlers.
  - `src/services/`: Business logic.
  - `src/repositories/`: Data access layer (interacting with Supabase).
  - `src/socket/`: Socket.io event handling.
  - `src/middleware/`: Auth verification (JWT).

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Supabase Project

### 1. Environment Variables

Create `.env` in `server/`:
```
PORT=4000
CLIENT_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_JWT_SECRET=your_jwt_secret
SUPABASE_SERVICE_KEY=your_service_role_key
```

Create `.env.local` in `client/`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 2. Database Setup
Run the SQL script located in `server/src/db/schema.sql` in your Supabase SQL Editor to create tables and RLS policies.

### 3. Install Dependencies & Run

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## API Endpoints

- `POST /api/tasks`: Create task
- `GET /api/tasks`: Get tasks (Supports filters: status, priority)
- `GET /api/tasks/:id`: Get single task
- `PATCH /api/tasks/:id`: Update task
- `DELETE /api/tasks/:id`: Delete task

## Real-time Features (Socket.io)
- **Authentication**: Socket connects with credentials. `join_user` event joins user-specific room.
- **Task Updates**: `task:created`, `task:updated`, `task:deleted` broadcasted to invalidate React Query cache.
- **Notifications**: `notification:new` emitted to specific user room when assigned a task.

## Testing
Run backend unit tests:
```bash
cd server
npm test
```
