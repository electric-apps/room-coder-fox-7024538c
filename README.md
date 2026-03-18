# Todo App

A reactive, real-time todo application built with Electric SQL and TanStack DB. Create, complete, and delete tasks — changes sync instantly across all connected clients.

## Screenshot

![Todo App screenshot placeholder](https://placehold.co/800x450?text=Todo+App)

## Features

- Add new todos with a title
- Mark todos as complete/incomplete with optimistic updates
- Delete individual todos
- Filter by All / Active / Completed
- Clear all completed todos at once
- Real-time sync across browser tabs and clients via Electric SQL

## Getting Started

```bash
pnpm install
pnpm dev:start
```

The app will be available at `http://localhost:5173` (or the port set in `VITE_PORT`).

## Tech Stack

- **[Electric SQL](https://electric-sql.com)** — Postgres-to-client real-time sync via shapes
- **[TanStack DB](https://tanstack.com/db)** — Reactive collections with live queries and optimistic mutations
- **[Drizzle ORM](https://orm.drizzle.team)** — Schema definitions and Postgres migrations
- **[TanStack Start](https://tanstack.com/start)** — React meta-framework with SSR and server functions
- **[Radix UI Themes](https://www.radix-ui.com/themes)** — Design system and component library

## License

MIT
