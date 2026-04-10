# Todo App

A full-stack todo application built with Next.js 16, Auth.js v5, Prisma, and PostgreSQL.

## Features

- User authentication (credentials + Google OAuth)
- Create, read, update, and delete todos
- Protected dashboard routes
- JWT-based sessions

## Tech Stack

- **Framework**: Next.js 16.2.3
- **Auth**: Auth.js v5 (beta) with JWT strategy
- **Database**: Prisma 5.22 + PostgreSQL
- **UI**: shadcn/ui + Tailwind CSS v4 + React 19

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (running on localhost:5432)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/todo
AUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

3. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (includes lint + typecheck) |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npx prisma studio` | Open Prisma database browser |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Auth.js endpoints
│   │   └── todos/        # Todo CRUD API
│   ├── auth/signin/      # Sign in/register page
│   └── dashboard/       # Protected app area
├── lib/
│   ├── auth.ts           # Auth.js configuration
│   └── prisma.ts        # Prisma client
└── middleware.ts        # Route protection
```

## API Routes

- `POST /api/auth/register` - Register new user
- `GET /api/todos` - List user's todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/[id]` - Update todo
- `DELETE /api/todos/[id]` - Delete todo

All `/api/todos/*` routes require authentication.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API or People API
3. Create OAuth credentials (web app)
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`