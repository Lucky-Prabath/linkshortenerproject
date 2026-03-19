# Agent Instructions — Link Shortener

---


## Project Overview

This is a **full-stack URL shortener web application** built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Drizzle ORM, Neon PostgreSQL, and Clerk authentication.

### What the app does

- Allows users to paste a long URL and receive a short, shareable slug (e.g. `yourdomain.com/abc123`).
- Visiting a short link redirects the visitor to the original URL and increments a click counter.
- Authenticated users have a personal dashboard where they can view, copy, and delete their own links.
- Unauthenticated visitors can see the home page but must sign in to create or manage links.

### How the core flow works

1. **Home page** (`app/page.tsx`) — presents a URL input form. Submitting it calls a server action in `lib/actions/links.ts` which validates the URL, generates a unique slug, and inserts a row into the `link` table.
2. **Redirect route** (`app/[slug]/page.tsx`) — a dynamic Server Component that looks up the slug in the database. If found, it increments `click_count` and redirects to `original_url` with `redirect()`. If not found, it calls `notFound()`.
3. **Dashboard** (`app/dashboard/page.tsx`) — a protected page that fetches all links belonging to the signed-in user and renders a table of results. Deletion is handled by a server action; copying the short URL is handled by a `"use client"` component.
4. **Authentication** — managed entirely by Clerk. Route protection is enforced in `proxy.ts` using `clerkMiddleware`. The Clerk `userId` is stored directly as a column on the `link` table to scope all queries.

> [!WARNING]
> **`middleware.ts` is deprecated and must NOT be used in this project.** Next.js 16 (the version used here) has deprecated `middleware.ts` in favour of `proxy.ts`. All middleware logic — including Clerk route protection — must live in `proxy.ts`. Never create or modify `middleware.ts`.

### Data model

The primary (and currently only) table is `link` in `db/schema.ts`:

| Column         | Type        | Notes                       |
| -------------- | ----------- | --------------------------- |
| `id`           | `uuid`      | Primary key, auto-generated |
| `user_id`      | `text`      | Clerk `userId`, not null    |
| `original_url` | `text`      | The full destination URL    |
| `slug`         | `text`      | Unique short identifier     |
| `click_count`  | `integer`   | Defaults to `0`             |
| `created_at`   | `timestamp` | Defaults to `now()`         |
| `updated_at`   | `timestamp` | Updated on every mutation   |

### Key architectural decisions

- **No API routes for mutations.** All create/update/delete operations use Next.js server actions (`"use server"`), not `app/api/` routes.
- **Server Components fetch data.** Pages query the database directly as async Server Components — no client-side `useEffect`/`fetch` data loading.
- **Thin client boundary.** The only `"use client"` components are small interactive leaves (copy button, delete confirmation, etc.). Pages and layouts are always Server Components.
- **Single Drizzle client.** The `db` instance in `db/index.ts` is the only place a database connection is created. All queries import it via `@/db`.
- **Tailwind v4, no config file.** All theme tokens live in `app/globals.css` under `@theme inline`. There is no `tailwind.config.ts`.

---

## Core Principles

1. **TypeScript strict mode is non-negotiable.** Every file must pass `tsc --noEmit` with zero errors.
2. **App Router only.** This project uses the Next.js App Router. Never use the Pages Router.
3. **Server Components by default.** Only add `"use client"` when interactivity or browser APIs are required.
4. **Tailwind utility classes only.** Do not write custom CSS beyond what is in `app/globals.css`.
5. **No inline styles.** Use Tailwind classes or CSS variables.
6. **Use shadcn/ui components.** Do not hand-roll UI primitives that shadcn already provides.
7. **All database access goes through Drizzle ORM.** No raw SQL strings outside of migration files.
8. **All auth is handled by Clerk.** Do not implement custom auth logic.
11. **NEVER use `middleware.ts`.** It is deprecated in Next.js 16. All middleware (including Clerk route protection) must be placed in `proxy.ts` instead.
9. **Follow the existing file/folder naming conventions** documented in [docs/project-structure.md](docs/project-structure.md).
10. **Lint must pass.** Run `npm run lint` before considering any task complete.
