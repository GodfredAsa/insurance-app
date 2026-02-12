# Insurance API (FastAPI)

Backend for the insurance project. REST API with:

- **User management** — registration, JWT authentication. Data is stored in SQLite (`db/data.db`).
- **IFRS 17 reporting** — dashboard metrics, liability/CSM reconciliations, and raw data. Reads from a JSON file in the project root (no DB). No auth required for IFRS 17 endpoints.

This README helps you **understand and navigate the codebase** and **contribute** from scratch.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Architecture (MVC)](#architecture-mvc)
- [Request flow](#request-flow)
- [Key concepts](#key-concepts)
- [API reference](#api-reference)
- [IFRS 17 API](#ifrs-17-api)
- [Database](#database)
- [Authentication](#authentication)
- [Configuration](#configuration)
- [How to add a new feature](#how-to-add-a-new-feature)

---

## Tech stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Framework   | FastAPI                              |
| DB          | SQLite (file: `db/data.db`)          |
| ORM         | SQLAlchemy 2                         |
| Validation  | Pydantic                             |
| Auth        | JWT (PyJWT), bcrypt for passwords    |
| Server      | Uvicorn                              |

---

## Prerequisites

- **Python 3.10+**
- Terminal and a code editor

---

## Quick start

```bash
cd api-server
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

- **API base:** http://127.0.0.1:8000  
- **Interactive docs:** http://127.0.0.1:8000/docs  

**Important:** Run uvicorn from inside the `api-server` directory. Use `main:app`, not `app.main:app` (there is no `app` package).

**IFRS 17 data:** The IFRS 17 endpoints read from `ifrs17_sample_data.json` in the **project root** (parent of `api-server`). Ensure that file exists there, or the IFRS 17 routes will return 503.

---

## Project structure

```
api-server/
├── main.py                 # App entry point; mounts routers; startup (DB + default admin)
├── database.py             # SQLite engine, session, init_db(); DB file: db/data.db
├── requirements.txt        # Python dependencies
├── run.sh                  # Convenience script: runs uvicorn from api-server
│
├── api/                    # VIEW layer — HTTP routes only
│   └── v1/
│       ├── user_view.py    # User CRUD: list, get by id, create
│       ├── auth_view.py    # Auth: register, login
│       └── ifrs17_view.py   # IFRS 17: metadata, dashboard, reconciliations, data (no auth)
│
├── presenters/             # PRESENTER layer — coordinates view and service; shapes responses
│   ├── user_presenter.py   # User responses (domain → UserResponse)
│   └── auth_presenter.py   # Register/login (calls service + JWT)
│
├── services/               # Business logic; talks to DB or file
│   ├── user_service.py     # User CRUD, auth, default admin; uses SQLAlchemy sessions
│   ├── ifrs17_data.py      # Load/cache ifrs17_sample_data.json from project root
│   └── ifrs17_engine.py    # IFRS 17 aggregations, reconciliations, dashboard metrics
│
├── models/                 # MODEL layer
│   ├── user_model.py       # Domain model: User dataclass + Role enum (used in services)
│   └── db_models.py        # SQLAlchemy table: UserTable (users table)
│
├── schemas/                # Pydantic request/response shapes (API contract)
│   ├── user_schema.py      # UserCreate, UserResponse, LoginRequest, TokenResponse
│   └── ifrs17_schema.py    # IFRS 17 response shapes (Metadata, reconciliation rows)
│
├── auth/                   # Auth utilities (no routes)
│   └── jwt.py              # create_access_token(); SECRET_KEY, expiry
│
└── db/                     # Database file (created at runtime)
    ├── .gitkeep            # Keeps folder in git
    └── data.db             # SQLite database (created on first run)
```

### What each layer does

| Layer      | Folder        | Role |
|-----------|----------------|------|
| **View**  | `api/v1/`      | Defines routes (URL, method). Parses request body, calls presenter, returns HTTP status/body. No business logic. |
| **Presenter** | `presenters/` | Calls service, converts domain objects to response schemas (e.g. `User` → `UserResponse`). |
| **Service**   | `services/`   | Business logic. Uses `database.SessionLocal()` and `models.db_models` to read/write DB. Returns domain `User` (from `models.user_model`). |
| **Model**     | `models/`     | `user_model.py`: in-memory domain entity (dataclass). `db_models.py`: SQLAlchemy table definition for the DB. |
| **Schemas**   | `schemas/`    | Pydantic models for request body and response JSON (validation + docs). |

---

## Architecture (MVC)

Flow is **View → Presenter → Service → Database**.

- **View:** “What URL and method? What body?” → calls **Presenter**.
- **Presenter:** “What should we return?” → calls **Service**, maps result to **Schema**.
- **Service:** “What’s the rule?” → opens DB session, uses **db_models**, returns **domain model** (e.g. `User`).

```
  Client
     │
     ▼
  api/v1/user_view.py   (route: GET /api/v1/users)
     │
     ▼
  presenters/user_presenter.py   (list_users → user_service.list_all())
     │
     ▼
  services/user_service.py   (db.query(UserTable).all() → list[User])
     │
     ▼
  database.py + models/db_models.py   (SQLite db/data.db)
```

---

## Request flow

Example: **GET /api/v1/users**

1. **`api/v1/user_view.py`** — `list_users()` is called.
2. **`presenters/user_presenter.py`** — `list_users()` calls `user_service.list_all()`.
3. **`services/user_service.py`** — `list_all()` opens a session, queries `UserTable`, maps rows to `User` domain objects, closes session, returns `list[User]`.
4. **Presenter** — Maps each `User` to `UserResponse` (id, email, name, role, created_at).
5. **View** — Returns the list as JSON (FastAPI uses `response_model=list[UserResponse]`).

Same idea for **POST /api/v1/users** (create), **GET /api/v1/users/{id}**, **POST /api/v1/register**, **POST /api/v1/login**: view → presenter → service → DB (or auth helper for JWT).

---

## Key concepts

- **Domain model (`models/user_model.py`)**  
  `User` dataclass and `Role` enum. Used inside the app (services, presenters). Not sent raw over the wire.

- **DB model (`models/db_models.py`)**  
  `UserTable`: SQLAlchemy table `users`. Columns: id, email, name, password_hash, role, created_at. Service converts between `UserTable` rows and `User` via `_row_to_user()`.

- **Schemas (`schemas/user_schema.py`)**  
  Define what the API accepts and returns: `UserCreate`, `UserResponse`, `LoginRequest`, `TokenResponse`. Used in route signatures and `response_model=`.

- **Sessions**  
  Each service method that touches the DB creates its own `SessionLocal()` session and closes it in a `finally` block. No global shared session.

---

## API reference

**Public (no token):** `POST /api/v1/register`, `POST /api/v1/login`, and **all `/api/v1/ifrs17/*`** endpoints.  
**Protected (JWT required):** `/`, `/health`, `/api/v1/users` and `/api/v1/users/{id}`. Use header: `Authorization: Bearer <access_token>`.

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/` | Yes | API info |
| GET | `/health` | Yes | Health check |
| GET | `/api/v1/users` | Yes (Admin only) | List all users (from DB) |
| GET | `/api/v1/users/{user_id}` | Yes | Get one user |
| POST | `/api/v1/users` | Yes | Create user (body: email, name, password) |
| POST | `/api/v1/register` | **No** | Register (same as create; 409 if email exists) |
| POST | `/api/v1/login` | **No** | Login (body: email, password) → `{ "access_token": "...", "token_type": "bearer" }` |

Default admin (created on startup): **admin@admin.com** / **1234**.

---

## IFRS 17 API

IFRS 17 endpoints are **public** (no JWT required). They serve dashboard summaries, liability/CSM reconciliations, and raw data for the IFRS 17 report (see project root `IFRS17_SYSTEM_BUILD_PLAN.md` and `index.html`).

**Data source:** The server reads from **`ifrs17_sample_data.json`** in the **project root** (the directory that contains `api-server/`). The path is resolved from `api-server/services/ifrs17_data.py` as `../ifrs17_sample_data.json`. If the file is missing, all IFRS 17 routes return **503** with a detail message.

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/ifrs17/metadata` | Reporting date, currency, portfolios |
| GET | `/api/v1/ifrs17/dashboard/summary` | Totals, trend %, by_portfolio (for cards and charts) |
| GET | `/api/v1/ifrs17/dashboard` | Combined: summary + liability trend + CSM trend + portfolio comparison |
| GET | `/api/v1/ifrs17/dashboard/liability-trend` | Labels and values for liability-by-cohort line chart |
| GET | `/api/v1/ifrs17/dashboard/csm-trend` | Labels and values for CSM-by-cohort line chart |
| GET | `/api/v1/ifrs17/dashboard/portfolio-comparison` | Table: portfolio, contracts, premium, claims, loss %, liability, CSM |
| GET | `/api/v1/ifrs17/reconciliations/liability` | Liability reconciliation rows + totals |
| GET | `/api/v1/ifrs17/reconciliations/csm` | CSM reconciliation rows + totals + insurance revenue from CSM release |
| GET | `/api/v1/ifrs17/data` | Raw data. Optional: `?portfolio=Motor` or `?cohort_year=2024` |

**Quick test (no token):**

```bash
curl -s http://127.0.0.1:8000/api/v1/ifrs17/metadata
curl -s http://127.0.0.1:8000/api/v1/ifrs17/dashboard/summary
```

---

**Quick test with admin (users):**

```bash
# 1. Login as admin → get access_token
curl -X POST http://127.0.0.1:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"1234"}'

# 2. Call a protected endpoint (replace YOUR_ACCESS_TOKEN with the token from step 1)
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" http://127.0.0.1:8000/api/v1/users
```

---

## Database

- **File:** `db/data.db` (created automatically on first run).
- **Setup:** `database.py` defines the engine and `SessionLocal`. `init_db()` creates tables and is called in `main.py` on startup.
- **Tables:** Defined in `models/db_models.py` (e.g. `UserTable` → table `users`).
- **Debug SQL:** Set env `SQL_ECHO=1` to log SQL.

---

## Authentication

- **Register:** `POST /api/v1/register` with `email`, `name`, `password`. Password is hashed with bcrypt and stored. Role is always `USER`.
- **Login:** `POST /api/v1/login` with `email`, `password`. Example body: `{"email":"admin@admin.com","password":"1234"}`. On success, returns a JWT in `access_token`; use it in the `Authorization: Bearer <token>` header for protected routes.
- **JWT:** Built in `auth/jwt.py` via `create_access_token(sub=user_id)`. Configurable with env vars below.

**Using the token:** Set the header exactly to `Authorization: Bearer <access_token>`, where `<access_token>` is the **exact** string from the login response’s `access_token` field (no extra quotes or spaces). If you get 401, check: token not expired, same server/process that issued it (same `SECRET_KEY`), and no typo when copying the token.

---

## Configuration

| Env variable | Purpose | Default |
|--------------|---------|---------|
| `SECRET_KEY` | JWT signing | `dev-secret-change-in-production` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiry (minutes) | `60` |
| `SQL_ECHO` | Log SQL (1/true to enable) | off |

Use a strong `SECRET_KEY` in production.

**IFRS 17:** Data file path is fixed: project root `ifrs17_sample_data.json`. To use another path you would need to change `services/ifrs17_data.py` (e.g. env var or config).

---

## How to add a new feature

Use this as a checklist when adding a new resource or endpoint (e.g. “policies” or “claims”).

1. **Schema** (`schemas/`)  
   Add Pydantic models for request/response (e.g. `PolicyCreate`, `PolicyResponse`).

2. **DB model** (`models/db_models.py`)  
   Add the SQLAlchemy table (e.g. `PolicyTable`). Run the app once so `init_db()` creates the table (or add migrations later).

3. **Domain model** (optional)  
   If you want a domain entity like `User`, add it in `models/` (e.g. `policy_model.py`).

4. **Service** (`services/`)  
   Add a service (e.g. `policy_service.py`) that uses `SessionLocal()`, queries/inserts the new table, and returns domain objects or IDs.

5. **Presenter** (`presenters/`)  
   Add a presenter that calls the service and maps results to your response schemas.

6. **View** (`api/v1/`)  
   Add a view (e.g. `policy_view.py`) with routes (GET, POST, etc.) that call the presenter and return the right status codes.

7. **Register in `main.py`**  
   `app.include_router(policy_view.router, prefix="/api/v1/policies", tags=["policies"])`.

8. **Startup (if needed)**  
   If the new feature needs initial data or DB setup, hook it into the `on_startup()` in `main.py`.

Following this keeps the same MVC flow and makes the codebase easy to navigate and extend.

---

## Run options

- From **api-server** directory:  
  `uvicorn main:app --reload`

- From project root:  
  `cd api-server && uvicorn main:app --reload`

- Or use the script:  
  `./run.sh` (ensure venv is activated if you use it)
