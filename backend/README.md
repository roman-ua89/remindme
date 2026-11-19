# RemindMe Backend

Express REST API for RemindMe. Uses Prisma + PostgreSQL, JWT auth (httpOnly cookies), and shared API contracts from `@remindme/contracts`.

**Base URL:** `http://localhost:3000/api/v1`

## Prerequisites

- Node.js `^26`
- Docker (for local PostgreSQL)
- Dependencies installed from the **repo root**:

```bash
cd .. && npm install
```

## First-time setup

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start PostgreSQL
docker compose up -d

# 3. Run migrations
npm run db:migrate

# 4. Seed roles, permissions, and the dev admin user
npm run db:seed:base
npm run db:seed:dev
```

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable                | Default                                                  | Description                                                                                         |
| ----------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `PORT`                  | `3000`                                                   | API server port                                                                                     |
| `DATABASE_URL`          | `postgresql://remindme:remindme@localhost:5432/remindme` | PostgreSQL connection string                                                                        |
| `DIRECT_URL`            | —                                                        | Direct PostgreSQL URL for the Prisma CLI (`directUrl`); the app does not read it                    |
| `JWT_SECRET`            | —                                                        | Secret for signing auth tokens (min 16 chars)                                                       |
| `JWT_EXPIRES_IN`        | `7d`                                                     | Token lifetime                                                                                      |
| `CORS_ORIGIN`           | —                                                        | Frontend origin allowed by CORS (`http://localhost:5173` for Vite); unset means CORS is not enabled |
| `UPLOAD_DIR`            | `./uploads`                                              | Local directory for uploaded images (`local` driver)                                                |
| `MAX_UPLOAD_BYTES`      | `4194304`                                                | Max upload size (4 MB)                                                                              |
| `STORAGE_DRIVER`        | `local`                                                  | Media storage: `local` (disk under `UPLOAD_DIR`) or `vercel-blob`                                   |
| `BLOB_READ_WRITE_TOKEN` | —                                                        | Vercel Blob read/write token; required when `STORAGE_DRIVER=vercel-blob`                            |
| `APP_COMMIT_SHA`        | `local`                                                  | Commit SHA returned by `GET /api/v1/health`                                                         |

## Database

### Start / stop PostgreSQL

```bash
docker compose up -d      # start
docker compose down       # stop
docker compose logs -f    # view logs
```

### Migrations

```bash
npm run db:migrate          # apply migrations (development)
npm run db:migrate:deploy   # apply migrations (production/CI)
npm run db:generate         # regenerate Prisma client after schema changes
```

From the repo root you can also run:

```bash
npm run db:migrate -w backend
```

### Seed data

```bash
npm run db:seed:base   # roles and permissions
npm run db:seed:dev    # dev admin account (refuses to run when NODE_ENV=production)
```

`db:seed:base` seeds roles (`user`, `admin`) and permissions. `db:seed:dev` seeds a dev admin account:

- **Email:** `admin@remindme.local`
- **Password:** `admin12345`

### Prisma Studio (DB browser)

```bash
npm run db:studio
```

## Run the API

### Development (hot reload)

```bash
npm run dev
```

From repo root:

```bash
npm run dev:backend
```

### Production build

```bash
npm run build
npm start
```

## Useful endpoints

| URL                          | Description                   |
| ---------------------------- | ----------------------------- |
| `GET /health`                | Health check                  |
| `GET /api/docs`              | Swagger UI (development only) |
| `POST /api/v1/auth/register` | Register                      |
| `POST /api/v1/auth/login`    | Login (sets httpOnly cookie)  |
| `GET /api/v1/auth/me`        | Current user                  |

## Project layout

```
backend/
  prisma/           # schema, migrations, seed
  src/
    config/         # env validation
    lib/            # prisma, errors, jwt
    middleware/     # auth, validate, error handling
    modules/        # domain routes + services
    app.ts          # Express app setup; default export is the Vercel handler
    server.ts       # local dev entry point (listens on PORT)
  docker-compose.yml
```

## Common issues

**Docker not running** — `docker compose up -d` fails if the Docker daemon is not started.

**Port 3000 in use** — change `PORT` in `.env` and the `/api` proxy target in `frontend/vite.config.ts` to match. Leave `VITE_API_URL` unset in the frontend `.env`.

**Migration drift** — after editing `prisma/schema.prisma`, run `npm run db:migrate` to create and apply a new migration.
