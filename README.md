# SchoolNet — Frontend

> React 19 + TypeScript SPA for the SchoolNet e-learning platform.  
> Supports student course browsing, subscription payments, video playback (MUX), and teacher course/content management.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [Pages & Components](#pages--components)
- [API Layer](#api-layer)
- [Authentication](#authentication)
- [External Integrations](#external-integrations)
- [Known Issues & Unfinished Features](#known-issues--unfinished-features)

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| TypeScript | 4.9.x | Type safety |
| React Router DOM | 7.9.x | Client-side routing |
| `@mux/mux-player-react` | 3.8.x | MUX HLS video player component |
| `@mux/upchunk` | 3.5.x | Chunked video upload to MUX |
| `tus-js-client` | 4.3.x | TUS resumable upload protocol client |
| CSS Modules | — | Scoped component-level styles |

> **No UI component library** — all styling is hand-written Vanilla CSS with CSS Modules.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- The [SchoolNet backend](../README.md) running locally on `http://localhost:5000`

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at **`http://localhost:3000`**.

The backend API base URL is configured in:

```ts
// src/api/ApiConf.ts
export const ApiURL = "http://localhost:5000/api/";
```

Update this if your backend runs on a different port.

---

## Project Structure

```
schoolnet-FE/
├── public/
│   ├── index.html
│   └── logo.jpg
│
└── src/
    ├── index.tsx              ← App entry point + React Router configuration
    ├── index.css              ← Global styles / CSS variables
    ├── App.tsx                ← Root shell (currently minimal)
    │
    ├── api/                   ← All backend communication (fetch wrappers + TypeScript types)
    │   ├── ApiConf.ts         ← Base URL configuration
    │   ├── Authentication.ts  ← Login, signup, logout
    │   ├── Courses.ts         ← Course CRUD, enrolled/managed courses
    │   ├── Content.ts         ← Course content list + individual content fetch
    │   ├── Home.ts            ← Home dashboard data + TypeScript DTO types
    │   ├── Subscription.ts    ← Subscription check + Stripe pay
    │   ├── CourseHandlers.ts  ← Course teacher handler queries
    │   └── User.ts            ← (stub — user profile fetch)
    │
    ├── Services/
    │   └── Auth_Service.ts    ← localStorage helpers: getCurrentUser(), token validity
    │
    └── Components/
        ├── MainLayout.tsx                   ← Shell wrapping NavBar + Footer + page content
        ├── NavBar.tsx                       ← Responsive nav with frosted-glass scroll effect
        ├── Footer.tsx
        │
        ├── LandingPage.tsx                  ← Public marketing/landing page (route: /)
        ├── LoginPage.tsx                    ← Login form for student & teacher (route: /Login)
        ├── SigninPage.tsx                   ← Multi-step registration form (route: /Signin)
        │
        ├── HomePage.tsx                     ← Role-aware home dashboard shell (route: /Home)
        ├── StudentHomeView.tsx              ← Student dashboard: stats + enrolled courses grid
        ├── TeacherHomeView.tsx              ← Teacher dashboard: stats + managed courses grid
        ├── StatCard.tsx                     ← Reusable stat number card
        ├── Avatar.tsx                       ← User avatar with initials fallback
        │
        ├── AllCoursesPage.tsx               ← Browse all courses (route: /Courses)
        ├── MyCoursesPage.tsx                ← My courses + add course modal (route: /MyCourses)
        ├── CourseCard.tsx                   ← Course summary card component
        │
        ├── CourseContentsPage.tsx           ← Course detail + content list (route: /Course/:CourseID)
        ├── ContentXPage.tsx                 ← MUX video player page (route: /Content/:ContentID)
        │
        ├── Add_EditCourseModal.tsx          ← Add/Edit course form modal
        ├── Add_EditContentModal.tsx         ← Add content + MUX video upload modal
        └── CourseOptionsMenu.tsx            ← Teacher options popup (Edit / Add Content)
```

---

## Routing

All routes are defined in [`src/index.tsx`](src/index.tsx) using React Router DOM v7.

| Path | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `LandingPage` | ❌ | Public landing / marketing page |
| `/Home` | `HomePage` | ✅ | Role-aware dashboard (student or teacher) |
| `/Courses` | `AllCoursesPage` | ❌ | Browse all available courses |
| `/MyCourses` | `MyCoursesPage` | ✅ | Enrolled courses (student) or managed courses (teacher) |
| `/Course/:CourseID` | `CourseContentsPage` | Optional | Course detail + content list |
| `/Content/:ContentID` | `ContentXPage` | ✅ | MUX video player for a specific lesson |
| `/Login` | `LoginPage` | ❌ | Login form |
| `/Signin` | `SigninPage` | ❌ | Registration form (student or teacher) |
| `*` (catch-all) | `HomePage` | ✅ | Redirects unknown paths to home |

---

## Pages & Components

### `LandingPage`
Public-facing hero page. Links to login and signup. No API calls.

### `LoginPage`
Login form supporting both **student** and **teacher** modes (via a mode toggle).  
On success: stores `current_user` and `auth_token_expireAt` in `localStorage`. The actual session is maintained server-side via an `HttpOnly` cookie.

### `SigninPage`
Multi-step registration supporting both roles.  
Steps: Personal Info → Account Info → Submission.

### `HomePage` + `StudentHomeView` / `TeacherHomeView`
Fetches `GET /api/Home` on mount. Renders different views based on `role` field in response:
- **Role 1 (Student)**: Profile hero, 3 stat cards (enrolled / active / paid), enrolled courses grid with status badges.
- **Role 2 (Teacher)**: Profile hero, 3 stat cards (courses / students / content), managed courses grid with permission badge.

### `AllCoursesPage`
Fetches all courses from `GET /api/Course/All`. Renders a responsive grid of `CourseCard` components, each linking to `/Course/:id`.

### `MyCoursesPage`
Fetches courses specific to the logged-in user from `GET /api/Course/My`.  
- **Teachers**: shows an "Add New Course" button that opens `Add_EditCourseModal`.
- **Students**: shows enrolled/subscribed courses.

### `CourseContentsPage`
Fetches course info (`GET /api/Course/{id}`) and content list (`GET /api/Content/{courseid}`) in parallel.  
- **Teachers**: shows "Edit" button → opens `CourseOptionsMenu` → `Add_EditCourseModal` or `Add_EditContentModal`.
- **New students (unsubscribed)**: shows "Subscribe Now" button → calls `POST /api/Subscribtion/Pay` → redirects to Stripe checkout.
- **Subscribed students**: can click content items to navigate to `/Content/:id`.

### `ContentXPage`
Fetches signed MUX playback URL from `GET /api/Content/ContentID/{id}`.  
Renders `<mux-player>` (Web Component) with the signed JWT token for secure HLS streaming.

### `Add_EditCourseModal`
Dual-mode form (Add new / Edit existing). Submits to `POST /api/Course/Add` (add mode). Edit mode endpoint is pending backend implementation.

### `Add_EditContentModal`
Upload flow:
1. Submit form → `POST /api/Content/Add` to create content record.
2. `POST /api/Content/DirectUpload/{id}` to get MUX upload URL.
3. Upload video file directly to MUX using `@mux/upchunk`.

---

## API Layer

All backend calls are organized in `src/api/`. Every function returns a typed result object.

```
src/api/
├── ApiConf.ts          → export const ApiURL = "http://localhost:5000/api/"
├── Authentication.ts   → login(), studentSignUp(), teacherSignUp()
├── Courses.ts          → FetchAllCourses(), FetchCourseById(), FetchCoursesOfUserX(), AddCourse()
├── Content.ts          → GetCourseXContents(), GetContentByID(), AddContent(), GetDirectUploadUrl()
├── Home.ts             → fetchHome()  +  all Home DTO type definitions
├── Subscription.ts     → handleSubscribe(), checkUserHasAccess()
├── CourseHandlers.ts   → (stub — not implemented yet)
└── User.ts             → (stub — not implemented yet)
```

All requests use `credentials: "include"` to send the auth cookie cross-origin.

---

## Authentication

Authentication state is managed across two mechanisms:

| Mechanism | What it stores | Purpose |
|---|---|---|
| **Server-side cookie** (`HttpOnly`) | Session identity | Actual auth — sent automatically on every request |
| **`localStorage`** key `current_user` | `{ id, fullName, mode }` | UI display only (name in navbar, role-based UI toggling) |
| **`localStorage`** key `auth_token_expireAt` | ISO date string | Client-side expiry check to prompt re-login |

Helper functions live in `src/Services/Auth_Service.ts`:

```ts
getCurrentUser()         // returns user object or null
CurrentTokenIsValide()   // returns true if token hasn't expired
GetTokenExpireAtDate()   // returns raw expiry string
```

> **Important**: clearing `localStorage` does **not** log the user out of the server session. A proper logout needs to call a backend endpoint that calls `HttpContext.SignOutAsync()`.

---

## External Integrations

### MUX Video Player
Content playback uses the official MUX Web Component via `@mux/mux-player-react`.

```tsx
<mux-player
  playback-id={signedPlaybackId}
  tokens={{ playback: jwtToken }}
  stream-type="on-demand"
/>
```

Playback URLs are **signed JWTs** generated server-side — they expire and cannot be hotlinked.

### Stripe Checkout
When a student clicks "Subscribe Now":
1. Frontend calls `POST /api/Subscribtion/Pay` with the course ID.
2. Backend creates a Stripe Checkout Session and returns `{ checkout_url }`.
3. Frontend redirects the user to the Stripe-hosted payment page.
4. After payment, Stripe fires a webhook to the backend which creates the `Subscription` record.

---

## Known Issues & Unfinished Features

| Feature | Status | Notes |
|---|---|---|
| `App.tsx` component body | ⚠️ Empty | The `App` function has no return — routing is handled entirely from `index.tsx` |
| Profile image in NavBar | ⚠️ Commented out | NavBar profile picture link is commented out pending profile page |
| `CourseHandlers.ts` | ❌ Stub | File is essentially empty (`96 bytes`) |
| `User.ts` | ❌ Stub | No user profile fetch implemented |
| Course update endpoint | ❌ Missing | Edit course modal exists, but `PUT /api/Course/{id}` doesn't exist on the backend yet |
| Logout functionality | ❌ Missing | No logout button or API call implemented |
| Pagination | ❌ Missing | All course/content lists load everything at once |
| Content access check | ⚠️ Inverted | `HandleNavigatingToContentXPage` — `!= "subscribed_student"` logic appears inverted |
| Account settings page | ❌ Missing | No page for teacher to complete Stripe onboarding |
| Error handling | ⚠️ Partial | Some fetch errors silently fail without user-facing messages |
