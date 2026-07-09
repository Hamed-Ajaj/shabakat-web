# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React + TypeScript app. Entry starts at [`src/main.tsx`](/home/hamed-archy/work-projects/shabakat/shabakat-web/src/main.tsx) and mounts [`src/app/App.tsx`](/home/hamed-archy/work-projects/shabakat/shabakat-web/src/app/App.tsx). Keep product code under `src/app/`: `features/` for route-level domains, `routes/` for router setup, `providers/` for app state, `shell/` for layout, and `shared/` for reusable domain UI/data/types. Current feature areas include `auth`, `areas`, `dashboard`, `invoices`, `settings`, and `subscribers`. shadcn support folders and small reusable hooks live in `src/hooks/` and `src/lib/`. Shared primitives are in `src/app/components/ui/`. Global styling stays in `src/styles/`.

## Build, Test, and Development Commands
Use `pnpm`.

- `pnpm install`: install and sync dependencies.
- `pnpm dev`: run the local Vite server.
- `pnpm build`: create the production bundle in `dist/`.
- `pnpm preview`: serve the built app locally.
- `pnpm typecheck`: run TypeScript checks.
- `pnpm lint`: run ESLint across the repo.

## Coding Style & Naming Conventions
Favor feature-first structure over large page files. Put route-specific UI inside that feature’s `components/` folder; move cross-feature pieces into `shared/`.

- Use `PascalCase` for components, pages, and providers.
- Use `camelCase` for variables, functions, and props.
- Use descriptive filenames such as `SettingsPage.tsx`, `SettingsProvider.tsx`, and `subscriberColumns.tsx`.

Prefer functional React components, explicit local types, and route-driven navigation with `react-router-dom`. TanStack Table is used for subscribers, while the areas screen uses query-backed card lists and sheet/dialog CRUD flows.

- Every new route/page should ship with a visible loading state.
- Prefer route-level lazy loading for pages and lazy loading for heavy secondary UI such as sheets/dialogs when practical.
- Use skeleton loaders instead of plain loading text for primary page content whenever data is expected to take noticeable time.

## Testing Guidelines
There is no dedicated automated test suite yet. Before opening a PR, run `pnpm lint`, `pnpm typecheck`, and `pnpm build`, then verify the main routes in `pnpm dev`: `/login`, `/dashboard`, `/areas`, `/subscribers`, `/invoices`, and `/settings`. If tests are added later, place them near the feature they cover and use `*.test.tsx`.

## Commit & Pull Request Guidelines
Use short imperative commits such as `refactor: migrate shell to shadcn sidebar` or `feat: add settings detail routes`. PRs should include a concise summary, linked work item, and screenshots for UI changes on desktop and mobile.

## Configuration Notes
Keep Vite, Tailwind, and shadcn aliases aligned across `vite.config.ts`, `tsconfig.json`, and `components.json`. The settings UI mirrors the mobile product, but only pricing, language, trigger date, and trigger message currently map to the backend `CompanyPreferences` contract; notification toggles are still web-local.
