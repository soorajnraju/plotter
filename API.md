# Plotter — API Reference

This document describes every HTTP endpoint exposed by the Plotter backend. All endpoints are hosted under the same domain as the web app (e.g. `https://your-app.vercel.app`).

---

## Base URL

```
https://<your-domain>
```

---

## Authentication

### How it works

- **Mobile clients** — send an `Authorization` header with a JWT access token obtained from the login or signup endpoints.
- **Web clients** — session cookies are set automatically by the browser; no header needed.

### Header format

```
Authorization: Bearer <access_token>
```

### Token lifecycle

| Token | Lifetime | How to renew |
|---|---|---|
| `access_token` | ~1 hour | Call `POST /api/auth/refresh` |
| `refresh_token` | 30 days (Supabase default) | Single-use; returns a new pair |

---

## Error responses

All error responses share the same structure:

```json
{ "error": "<human-readable message>" }
```

| Status | Meaning |
|---|---|
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — missing, invalid, or expired token |
| `403` | Forbidden — authenticated but not the resource owner |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Auth endpoints

### POST `/api/auth/signup`

Create a new account with email and password.

**Request body**

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | Yes | Must be a valid email |
| `password` | string | Yes | Minimum 6 characters |

**Response `201`**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2026-03-08T10:00:00Z"
  },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "abc123...",
    "expires_at": 1741600000
  },
  "message": "Account created and signed in."
}
```

> If email confirmation is enabled in your Supabase project, `session` will be `null` and `message` will ask the user to confirm their email.

**Error responses**

| Status | Body |
|---|---|
| `400` | `{ "error": "email and password are required" }` |
| `400` | `{ "error": "password must be at least 6 characters" }` |
| `400` | `{ "error": "User already registered" }` (Supabase message) |

---

### POST `/api/auth/login`

Sign in with email and password.

**Request body**

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response `200`**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2026-03-08T10:00:00Z"
  },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "abc123...",
    "expires_at": 1741600000
  }
}
```

**Error responses**

| Status | Body |
|---|---|
| `400` | `{ "error": "email and password are required" }` |
| `401` | `{ "error": "Invalid email or password" }` |

---

### POST `/api/auth/logout`

Invalidate the current access token.

**Headers** *(required)*

```
Authorization: Bearer <access_token>
```

**Response `204`** — No content.

**Error responses**

| Status | Body |
|---|---|
| `401` | `{ "error": "Authorization: Bearer <token> header required" }` |

---

### POST `/api/auth/refresh`

Exchange a refresh token for a new access/refresh token pair.

**Request body**

```json
{
  "refresh_token": "abc123..."
}
```

**Response `200`**

```json
{
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "xyz789...",
    "expires_at": 1741603600
  }
}
```

> Refresh tokens are **single-use**. Store the new `refresh_token` after every refresh.

**Error responses**

| Status | Body |
|---|---|
| `400` | `{ "error": "refresh_token is required" }` |
| `401` | `{ "error": "Invalid or expired refresh token" }` |

---

### GET `/api/auth/me`

Return the authenticated user's profile.

**Headers** *(required)*

```
Authorization: Bearer <access_token>
```

**Response `200`**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2026-03-08T10:00:00Z",
  "updated_at": "2026-03-08T10:00:00Z",
  "app_metadata": {},
  "user_metadata": {}
}
```

**Error responses**

| Status | Body |
|---|---|
| `401` | `{ "error": "Unauthorized" }` |

---

## Incident endpoints

### Incident object

```json
{
  "id": "uuid",
  "title": "Gas leak on Main St",
  "description": "Strong smell near the intersection.",
  "category": "fire",
  "severity": "high",
  "status": "active",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "address": "Main St & 1st Ave, San Francisco, CA",
  "reported_by": "user-uuid",
  "reported_by_email": "user@example.com",
  "created_at": "2026-03-08T10:00:00Z",
  "updated_at": "2026-03-08T10:05:00Z"
}
```

**Enum values**

| Field | Allowed values |
|---|---|
| `category` | `accident` · `fire` · `medical` · `crime` · `weather` · `other` |
| `severity` | `low` · `medium` · `high` · `critical` |
| `status` | `active` · `investigating` · `resolved` |

---

### GET `/api/incidents`

List all incidents, newest first. Publicly accessible — no auth required.

**Query parameters** *(all optional)*

| Parameter | Type | Description |
|---|---|---|
| `category` | string | Filter by category (exact match) |
| `severity` | string | Filter by severity (exact match) |
| `status` | string | Filter by status (exact match) |
| `search` | string | Case-insensitive substring match on `title` |

**Example**

```
GET /api/incidents?severity=critical&status=active&search=fire
```

**Response `200`**

```json
[
  { ...incident },
  { ...incident }
]
```

Returns an empty array `[]` when no results match.

---

### POST `/api/incidents`

Create a new incident. **Authentication required.**

**Headers**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request body**

```json
{
  "title": "Gas leak on Main St",
  "description": "Strong smell near the intersection.",
  "category": "fire",
  "severity": "high",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "address": "Main St & 1st Ave, San Francisco, CA"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | Max 200 characters |
| `category` | string | Yes | See enum values above |
| `severity` | string | Yes | See enum values above |
| `latitude` | number | Yes | −90 to 90 |
| `longitude` | number | Yes | −180 to 180 |
| `description` | string | No | Max 1 000 characters |
| `address` | string | No | Max 500 characters |

**Response `201`**

```json
{ ...incident }
```

**Error responses**

| Status | Body |
|---|---|
| `400` | `{ "error": "Missing required fields: title, category, severity, latitude, longitude" }` |
| `400` | `{ "error": "Invalid category" }` |
| `400` | `{ "error": "Invalid severity" }` |
| `400` | `{ "error": "Invalid coordinates" }` |
| `401` | `{ "error": "Unauthorized" }` |

---

### GET `/api/incidents/:id`

Fetch a single incident by its UUID. Publicly accessible — no auth required.

**Path parameter**

| Parameter | Type | Description |
|---|---|---|
| `id` | UUID string | The incident's `id` |

**Response `200`**

```json
{ ...incident }
```

**Error responses**

| Status | Body |
|---|---|
| `404` | `{ "error": "Incident not found" }` |

---

### PATCH `/api/incidents/:id`

Update an incident's `title`, `description`, and/or `status`. **Authentication required. Only the reporter can update.**

**Headers**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request body** *(all fields optional, at least one required)*

```json
{
  "title": "Updated title",
  "description": "Updated description.",
  "status": "investigating"
}
```

| Field | Type | Notes |
|---|---|---|
| `title` | string | Max 200 characters |
| `description` | string \| null | Max 1 000 characters; `null` clears it |
| `status` | string | `active` · `investigating` · `resolved` |

**Response `200`**

```json
{ ...incident }
```

**Error responses**

| Status | Body |
|---|---|
| `400` | `{ "error": "No valid fields to update" }` |
| `400` | `{ "error": "Invalid status" }` |
| `401` | `{ "error": "Unauthorized" }` |
| `403` | `{ "error": "Forbidden" }` |
| `404` | `{ "error": "Incident not found" }` |

---

### DELETE `/api/incidents/:id`

Delete an incident. **Authentication required. Only the reporter can delete.**

**Headers**

```
Authorization: Bearer <access_token>
```

**Response `204`** — No content.

**Error responses**

| Status | Body |
|---|---|
| `401` | `{ "error": "Unauthorized" }` |
| `403` | `{ "error": "Forbidden" }` |
| `404` | `{ "error": "Incident not found" }` |

---

## OAuth (Google)

Google sign-in is handled through a browser redirect flow. From a mobile app use a web view or the device browser:

1. Redirect the user to:
   ```
   https://<your-domain>/login
   ```
2. The user taps **Sign in with Google** → Supabase OAuth → redirects to `/auth/callback?code=...`.
3. The callback exchanges the code for a session (cookie-based for web).

For native mobile OAuth without a web view, use the [Supabase Flutter](https://supabase.com/docs/reference/dart) or [Supabase Swift/Kotlin](https://supabase.com/docs/reference/javascript) SDKs directly with `signInWithOAuth`.

---

## Rate limiting

No custom rate limiting is implemented at the application level. Supabase enforces its own limits on auth endpoints (e.g. signup/login) per project plan.
