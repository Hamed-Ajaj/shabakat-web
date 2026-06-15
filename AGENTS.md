# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React + TypeScript frontend. The app entry is [`src/main.tsx`](/home/hamed-archy/work-projects/shabakat/shabakat-web/src/main.tsx), which mounts [`src/app/App.tsx`](/home/hamed-archy/work-projects/shabakat/shabakat-web/src/app/App.tsx). Route definitions live in `src/app/routes/`, auth state in `src/app/providers/`, the reusable shell in `src/app/shell/`, shared UI/data/types in `src/app/shared/`, and feature pages in `src/app/features/<feature>/`. Current feature areas are `auth`, `dashboard`, `subscribers`, `invoices`, and `notifications`. Global styles remain in `src/styles/`.

## Build, Test, and Development Commands
Use `pnpm`; this repo keeps `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

- `pnpm install`: install and sync dependencies.
- `pnpm dev`: start the Vite dev server.
- `pnpm build`: create the production bundle in `dist/`.
- `pnpm preview`: serve the production build locally.
- `pnpm typecheck`: run TypeScript without emitting files.

## Coding Style & Naming Conventions
Keep code feature-first and modular. Avoid rebuilding large page files; extract shared parts into `shared/` and feature-specific parts into that feature’s `components/` folder.

- Use `PascalCase` for components, pages, and exported types.
- Use `camelCase` for functions, variables, and props.
- Use descriptive file names such as `SubscribersPage.tsx`, `AuthProvider.tsx`, and `subscriberColumns.tsx`.

Prefer functional React components, route-driven navigation with `react-router-dom`, and explicit local types. TanStack Table is used for subscriber table behavior, so column definitions should stay isolated from page layout code.

## Testing Guidelines
There is no dedicated test runner yet. Before opening a PR, run `pnpm typecheck` and `pnpm build`, then verify the main routes in `pnpm dev`:

- `/login`
- `/dashboard`
- `/subscribers`
- `/invoices`
- `/notifications`

If you add tests later, place them next to the feature they cover and name them `*.test.tsx`.

## Commit & Pull Request Guidelines
The git history is still minimal, so use short imperative commits such as `refactor: split dashboard into feature modules` or `feat: add login route and auth shell`. PRs should include a concise summary, linked task or issue, and screenshots for UI changes across desktop and mobile.

## Configuration Notes
Do not remove the React or Tailwind plugins from `vite.config.ts`. If you touch routing, auth, or table behavior, update this guide so the documented structure stays accurate.
