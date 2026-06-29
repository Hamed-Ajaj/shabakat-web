# Shabakat Web

Shabakat Web is the frontend dashboard for managing generator operations, subscribers, areas, invoices, and company settings. It is built with Vite, React, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, and TanStack Query.

The app connects to the Shabakat backend API and provides authenticated management flows for:

- login and session handling
- areas management
- subscribers CRUD
- invoice views
- company settings and pricing screens

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Zustand for client state
- TanStack Query for server state
- TanStack Table for subscribers table behavior
- React Hook Form + Zod for validated forms

## Project Structure

```text
src/
  app/
    App.tsx                # app composition
    components/ui/         # shadcn and shared UI primitives
    features/              # route-level product features
      areas/
      auth/
      dashboard/
      invoices/
      settings/
      subscribers/
    providers/             # auth, query, settings providers
    routes/                # router and protected-route setup
    shared/                # shared api helpers, components, data, types
    shell/                 # sidebar, top nav, mobile nav, app layout
  hooks/                   # reusable hooks such as debounce/mobile helpers
  lib/                     # utility helpers for shadcn setup
  styles/                  # global theme and base styles
```

## Main Routes

- `/login`
- `/dashboard`
- `/areas`
- `/subscribers`
- `/invoices`
- `/settings`

## Running Locally

### 1. Install dependencies

This project uses `pnpm`.

```bash
pnpm install
```

### 2. Configure environment variables

Create a local env file if needed:

```bash
cp .env.example .env
```

Current API variable:

```env
VITE_API_URL=http://localhost:5084
```

### 3. Start the backend

Make sure the backend API is running on `http://localhost:5084`.

If you are using the sibling backend project in the same workspace, run it from the backend repository before starting the frontend.

### 4. Start the frontend

```bash
pnpm dev
```

Vite will print the local URL, usually:

```text
http://localhost:5173
```

### 5. Log in

Use the seeded development account:

- Email: `owner@nour.com`
- Password: `Password123!`

## Useful Commands

```bash
pnpm dev         # start local dev server
pnpm build       # production build
pnpm preview     # preview the built app
pnpm lint        # run ESLint
pnpm typecheck   # run TypeScript checks
```

## Development Notes

- `src/app/features/` is the main place for product work.
- Use Zustand for app/client state such as auth and local preferences.
- Use TanStack Query for backend data fetching and cache invalidation.
- Subscribers search and pagination are backend-driven.
- Areas are shared across the Areas page and subscriber forms through a single query source.

## Current Scope

Implemented today:

- authentication against the backend API
- routed app shell
- areas CRUD
- subscribers CRUD
- settings screens
- linting and TypeScript checks

Planned or still expanding:

- deeper invoice workflows
- more dashboard integrations
- additional backend-driven table features where supported
