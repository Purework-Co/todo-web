# Todo App - Agent Instructions

## Commands
```bash
cd todo
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (lint + typecheck)
npm run lint         # ESLint only
npm run test         # Vitest (has Node 21 compatibility issues)
```

## Dev Workflow
1. Ensure PostgreSQL is running on `localhost:5432`
2. Run `npx prisma migrate dev` after schema changes
3. Run `npm run build` before committing (validates lint + types)

## Architecture
- **Auth**: Auth.js v5 (beta) with JWT strategy
- **Database**: Prisma 5.22 + PostgreSQL
- **UI**: shadcn/ui + Tailwind CSS v4

## Key Patterns

### Route Protection
- Middleware at `src/middleware.ts` protects `/dashboard/*`
- Unauthenticated users redirected to `/auth/signin`
- API routes check `auth()` session before operations

### Authentication Flow
- Credentials: email/password with bcrypt hashing
- OAuth: Google (requires `.env` credentials)
- Session: JWT (not database sessions)

### API Security
- All `/api/todos/*` routes require authenticated session
- Users can only access their own data (`userId` filter)
- Passwords never returned in API responses

## Required Env Variables
```
DATABASE_URL         # PostgreSQL connection
AUTH_SECRET          # Run: openssl rand -base64 32
NEXTAUTH_URL         # http://localhost:3000
GOOGLE_CLIENT_ID     # From Google Cloud Console
GOOGLE_CLIENT_SECRET # From Google Cloud Console
```

## Google OAuth Setup
1. Go to https://console.cloud.google.com/
2. Enable Google+ API or People API
3. Create OAuth credentials (web app)
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

## Prisma Workflow
```bash
npx prisma generate   # Update client after schema change
npx prisma migrate dev # Apply schema changes to DB
npx prisma studio      # Visual database browser
```

## Known Limitations
- Vitest has Node 21 compatibility issues (rolldown/styleText)
- shadcn/ui Select: onValueChange can return null, use `(val) => fn(val || default)`

## File Structure
todo/
├── prisma/schema.prisma    # DB models
├── src/app/api/auth/       # NextAuth + register
├── src/app/api/todos/      # Todo CRUD
├── src/app/auth/signin/    # Sign in/register
├── src/app/dashboard/      # Protected app
├── src/lib/auth.ts         # Auth.js config
├── src/lib/prisma.ts       # Prisma client
└── .env                    # Secrets (never commit)
```
