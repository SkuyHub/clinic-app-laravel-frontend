# Clinic App — Vue Frontend

Clinic management admin panel + doctor/patient portals. Vue 3 with TypeScript, Pinia, Tailwind CSS, and config-driven CRUD. Multi-guard JWT auth with unified login.

## Quick Start

```bash
npm install --ignore-scripts
npm run dev
```

Requires the [Laravel backend](https://github.com/SkuyHub/clinic-app-laravel-backend) running on `http://localhost:8000`.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint --fix |
| `npm run generate:crud <module> <route>` | Scaffold config + view for new entity |

## Architecture

### Config-driven CRUD

Each entity has a `CRUDCompositeConfig` in `src/app/configs/`. The `CRUDComposite.vue` reads the config and renders list/detail/create/update views via query params. Menu → router → sidebar are auto-generated from `src/menu.ts`.

**Config structure**:
```ts
CRUDCompositeConfig {
  name, title, modelAPI?         // Identity
  actions?: { create?, update?, delete?, detail? }
  view?: {
    fields, fieldsAlias, fieldsProxy, fieldsType
    list?: { ... }              // Override for list view
    detail?: { ... }            // Override for detail view
  }
  transaction?: {
    fields, targetAPI, inputConfig
    create?: { ... }            // Override for create
    update?: { ... }            // Override for update
  }
}
```

### Multi-guard auth

Three Pinia stores (`auth`, `doctorAuth`, `patientAuth`) with `createStorage(ns)`-backed localStorage tokens. The `http.ts` interceptor detects guard from `window.location.pathname` prefix (`/doctor`, `/patient`) and attaches the correct token. 401 responses redirect to `/login`.

### Permission gating

`permissions` Pinia store holds a `Set<string>` of task codes from `/me`. `CRUDComposite` checks permissions before rendering create/update/delete controls. Format: `view-{model}`, `show-{model}`, `create-{model}`, `update-{model}`, `delete-{model}`.

### Routing

| Prefix | Layout | Description |
|--------|--------|-------------|
| `/login` | None | Unified login — auto-detects role |
| `/` | `Authenticated.vue` (sidebar) | Admin panel |
| `/doctor` | `PortalLayout.vue` (top nav) | Doctor portal |
| `/patient` | `PortalLayout.vue` (top nav) | Patient portal |

## Components

### Base (4)

| Component | Purpose |
|-----------|---------|
| `Avatar` | Photo or initials fallback, 3 sizes, 6 color variants |
| `Badge` | Colored status badge (scheduled/completed/cancelled/available) |
| `Modal` | Teleported overlay, click-outside-to-close, title + slot |
| `BaseInput` | Label + required indicator + error message wrapper |

### Inputs (9)

`TextInput`, `PasswordInput`, `TextareaInput`, `NumberInput`, `DateInput`, `SelectInput` (async API data), `RadioInput` (boolean normalizer), `ImageInput` (upload + preview)

### Composites (6)

| Component | Purpose |
|-----------|---------|
| `CRUDComposite` | Top-level orchestrator — routes between list/detail/create/update |
| `Table` | Paginated, sortable data table with field type rendering |
| `Form` | Dynamic form from input config, server-side error mapping |
| `SearchBox` | Debounced search input |
| `Pagination` | Simple prev/next |
| `Modal` | Detail overlay |

### Layout (3)

| Component | Used by |
|-----------|---------|
| `Authenticated` | Admin — fixed sidebar + main content |
| `Sidebar` | Admin — menu-driven nav, user profile, logout |
| `PortalLayout` | Doctor/patient — sticky top nav, user chip, logout |

## Views

### Admin (9 pages)

| Route | Entity | Actions |
|-------|--------|---------|
| `/clinical/doctors` | Doctors | Full CRUD |
| `/clinical/patients` | Patients | Full CRUD |
| `/clinical/appointments` | Appointments | Full CRUD |
| `/clinical/rooms` | Rooms | Full CRUD |
| `/clinical/medicalrecords` | Medical Records | Full CRUD |
| `/access/users` | Users | Full CRUD |
| `/access/roles` | Roles | Full CRUD |
| `/access/tasks` | Tasks | Full CRUD |
| `/access/role-task` | Role-Task Mapping | Create, list, delete |
| `/profile` | My Profile | Self-edit |

### Doctor Portal (4 pages)

| Route | What it does |
|-------|-------------|
| `/doctor/dashboard` | Stats (today's apps, completed, pending) + today's queue |
| `/doctor/appointments` | Table with inline status update + detail modal showing patient records |
| `/doctor/medical-records` | Table with detail modal (diagnosis, treatment, prescription) |
| `/doctor/profile` | Avatar + photo upload + read-only fields |

### Patient Portal (4 pages)

| Route | What it does |
|-------|-------------|
| `/patient/dashboard` | Welcome banner + stats + upcoming appointments + booking form |
| `/patient/appointments` | Table with detail modal |
| `/patient/medical-records` | Table with detail modal (diagnosis, treatment, prescription) |
| `/patient/profile` | Avatar + photo upload + read-only fields |

## Utilities

| File | Purpose |
|------|---------|
| `http.ts` | Axios instance, multi-guard token interceptor, 401 → `/login` |
| `services.ts` | Typed CRUD wrapper (list, show, create, update, delete) |
| `storage.ts` | localStorage wrapper + `createStorage(ns)` factory |
| `upload.ts` | `POST /upload-tmp` helper |
| `files.ts` | File URL resolver |

## Configs (`src/app/configs/`)

Each entity exports a `CRUDCompositeConfig`. `_defaults.ts` provides shared exports:

| Export | What |
|--------|------|
| `statusBadge` | Appointment status badge map |
| `defaultFieldProxy` | FK proxy mappings (role_id → rel_role_id, etc.) |
| `defaultInputConfig` | Common input configs (fullname, email, password, etc.) |
| `booleanBadge()` | True/false → badge config |
| `booleanRadio()` | True/false → radio config |
| `defaultTableConfig` | id/created_at/updated_at aliases + datetime types |
| `defaultFormConfig` | 40+ field alias mappings |

## Environment

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Code Quality

ESLint + Prettier configured. `npm run lint` passes cleanly. Configs in `.eslintrc.cjs`, `.prettierrc.json`.

## Test Logins

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@clinic.test` | `Clinic~2026` |
| Doctor | `dr.hartono@clinic.test` | `Doctor~2026` |
| Patient | `patient1@clinic.test` | `Patient~2026` |

## Backend

The Laravel API lives at [clinic-app-laravel-backend](https://github.com/SkuyHub/clinic-app-laravel-backend).

## Dependencies

| Package | Purpose |
|---------|---------|
| Vue 3 + TypeScript | Framework |
| Pinia | State management |
| Vue Router | Routing |
| Axios | HTTP client |
| Tailwind CSS 3 | Styling |
| Remixicon | Icons |
| vue-sonner | Toast notifications |
| ESLint + Prettier | Linting & formatting |
