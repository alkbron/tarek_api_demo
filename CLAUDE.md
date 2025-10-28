# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a REST API built with Bun, Elysia, and Drizzle ORM for managing users and their pets (animals). The API uses SQLite as the database and includes auto-generated Swagger documentation.

## Tech Stack

- **Runtime**: Bun (uses native Bun APIs like `bun:sqlite`)
- **Web Framework**: Elysia (type-safe REST framework)
- **ORM**: Drizzle ORM with SQLite dialect
- **Validation**: Elysia's built-in TypeBox validation
- **Documentation**: Swagger UI via `@elysiajs/swagger`

## Development Commands

```bash
# Install dependencies
bun install

# Development mode with hot reload
bun run dev

# Production mode
bun run start

# Push schema changes to database (creates/updates tables)
bun run db:push

# Open Drizzle Studio (web UI for database inspection)
bun run db:studio
```

## Architecture

### Application Entry Point
[src/index.ts](src/index.ts) - Main server setup with Elysia, configures Swagger documentation, and registers route modules.

### Database Layer
- [src/db/index.ts](src/db/index.ts) - Database connection using Bun's native SQLite driver (`bun:sqlite`)
- [src/db/schema.ts](src/db/schema.ts) - Drizzle ORM schema definitions with relations
  - Defines two tables: `users` and `animals`
  - Uses Drizzle relations for one-to-many between users and animals
  - Animals have cascade delete when user is deleted
  - Exports TypeScript types inferred from schema

### Route Modules
Routes are organized in [src/routes/](src/routes/) with one file per resource:
- [src/routes/users.ts](src/routes/users.ts) - Full CRUD for users (includes animals in responses)
- [src/routes/animals.ts](src/routes/animals.ts) - Full CRUD for animals (includes user/owner in responses)

Each route module:
- Uses Elysia's prefix feature for grouping routes
- Includes TypeBox validation schemas for request bodies
- Uses Drizzle's query API with `with` for eager loading relations
- Includes Swagger documentation via `detail` option

### Data Model
- **Users**: id, nom, prenom, mail (unique), age
- **Animals**: id, nom, type (enum: "chien", "chat", "tigre"), age, couleur, userId (foreign key)
- Relationships: One user can have many animals (cascade delete)

### Key Patterns
1. **Type Safety**: Uses Drizzle's type inference (`$inferSelect`, `$inferInsert`) for TypeScript types
2. **Validation**: All POST/PUT endpoints use TypeBox schemas for runtime validation
3. **Error Handling**: Returns 404 with message for missing resources
4. **Relational Queries**: Uses Drizzle's `db.query.*.findMany()` with `with` option for eager loading
5. **Route Organization**: Separate Elysia instances per resource, composed in main app

## Database

- **File**: `sqlite.db` (in project root)
- **Migrations**: Not used - schema changes via `bun run db:push`
- **Schema Location**: [src/db/schema.ts](src/db/schema.ts)
- **Configuration**: [drizzle.config.ts](drizzle.config.ts)

## API Documentation

Once server is running:
- Swagger UI: http://localhost:3000/swagger
- OpenAPI JSON: http://localhost:3000/swagger/json

## Important Notes

- The database file `sqlite.db` is created automatically on first `db:push`
- All endpoints use French text for messages and descriptions
- Animals must reference an existing userId (enforced by foreign key)
- Deleting a user cascades to delete all their animals
- Email field on users has unique constraint
