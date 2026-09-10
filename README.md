# LightManager

LightManager is a personal task management application built with React, TypeScript, ASP.NET Core, and PostgreSQL.

The project originally started as a lightweight project management system for small teams. After continuing to develop and use it, I realized that a team-oriented workflow did not match how I personally manage tasks.

I therefore redesigned LightManager as a **personal task manager** focused on a smaller, simpler, and more practical daily workflow.

The current version focuses on:

- Quick task capture
- Daily planning
- Optional due dates
- Simple priorities
- Calendar-based scheduling
- Responsive desktop and mobile use
- A safe public Trial mode

The **Today** page acts as the main daily workspace, while the **Calendar** provides a broader scheduling view.

## Live Demo

**https://lightmanager.jiantao.dev**

Visitors can:

- Create an account
- Sign in
- Enter **Trial mode** and explore the application immediately

Trial mode does not require registration and does not modify the demo data stored in PostgreSQL.

---

## Features

### Task Management

- Create tasks
- Update tasks
- Complete and reopen tasks
- Delete tasks
- Optional due dates
- Automatic task sorting
- Today view
- Unscheduled task view
- Calendar view
- All Tasks view

### Priority System

LightManager uses three simple user-facing priority levels:

```text
Must
Priority
Non-priority
```

The backend currently stores these using the original enum values:

```text
High   -> Must
Medium -> Priority
Low    -> Non-priority
```

Tasks are automatically sorted in this order:

```text
Must
  ↓
Priority
  ↓
Non-priority
```

Tasks with the same priority are ordered by creation time, with older tasks appearing first.

The same sorting behavior is used consistently across the application.

---

## Today

The Today page is the main daily workspace.

It contains:

```text
Today
├── Today's Tasks
└── Unscheduled
```

Tasks can be created with or without a due date.

```text
No due date
     ↓
Unscheduled

Today's date
     ↓
Today

Future date
     ↓
Calendar
```

This keeps task capture simple while allowing scheduling to remain optional.

---

## Calendar

The Calendar provides both task scheduling and a quick visual overview of task importance.

Each date with unfinished tasks displays a colored indicator based on the **highest-priority unfinished task scheduled for that day**.

```text
Green  -> Non-priority
Yellow -> Priority
Red    -> Must
```

For example:

```text
Non-priority tasks only
        ↓
      Green

Includes Priority
        ↓
      Yellow

Includes Must
        ↓
       Red
```

Completed tasks do not affect the Calendar indicator.

If all tasks for a date are completed, the indicator disappears.

The Calendar also includes an **Unscheduled** task card so tasks without due dates remain visible while planning future work.

---

## Navigation

The primary navigation is intentionally kept small and focused.

### Desktop

```text
LightManager

Today
Calendar

[Account]
```

### Mobile

The bottom navigation contains only:

```text
Today     Calendar
```

Additional actions are available from the avatar menu.

### Account Menu

Clicking or tapping the avatar opens the account menu:

```text
Account
├── Settings
├── All Tasks
└── Sign Out
```

Moving **All Tasks** into the account menu keeps the primary navigation focused on the two most frequently used views.

The same menu is available on mobile, which also provides a clear Sign Out action.

### Trial Account Menu

Trial users see:

```text
Trial mode
├── All Tasks
└── Exit Trial
```

Settings are not available in Trial mode because Trial does not represent an authenticated personal account.

---

## Trial Mode

LightManager includes a Trial mode that allows visitors to explore the application without creating an account.

Trial mode loads task data from a dedicated demo account through a read-only endpoint.

```text
Visitor
   |
   v
Enter Trial
   |
   v
Read Demo Tasks
   |
   v
Create Local Copy
   |
   v
Browser Storage
```

After the initial load, the visitor works entirely with a local copy of the tasks.

Trial users can:

- Create tasks
- Update tasks
- Complete and reopen tasks
- Delete tasks
- Change priorities
- Add or remove due dates
- Use Today
- Use Calendar
- Use All Tasks

All Trial modifications remain local to the visitor's browser.

```text
Trial Tasks
    |
    +-- Create
    +-- Update
    +-- Complete
    +-- Delete
    |
    v
Local Browser Storage

    X

PostgreSQL
```

Trial users do **not** receive the demo account credentials or JWT token.

The backend exposes only a read-only Trial endpoint for retrieving the initial demo data.

This prevents Trial users from modifying the original demo account through the authenticated task API.

---

## Authentication

Registered users authenticate through ASP.NET Identity and JWT.

```text
User Login
    |
    v
ASP.NET Identity
    |
    v
Credential Validation
    |
    v
JWT Generated
    |
    v
Token Stored by Client
    |
    v
Protected API Requests
    |
    v
User-Specific Tasks
```

Protected task endpoints use the authenticated user's identity so each user can access only their own task data.

Trial mode follows a separate read-only initialization flow:

```text
Enter Trial
    |
    v
Anonymous Read-Only Trial API
    |
    v
Demo Task Data
    |
    v
Local Browser Storage
```

Trial users do not use authenticated write endpoints.

---

## Architecture

```text
                    React / TypeScript
                           |
                           | HTTPS
                           v
                  ASP.NET Core Web API
                           |
                           v
                  Entity Framework Core
                           |
                           v
                       PostgreSQL
```

### Authenticated User

```text
React Client
    |
    | JWT
    v
Protected Task API
    |
    v
User-Specific Tasks
    |
    v
PostgreSQL
```

### Trial User

```text
React Client
    |
    v
Read-Only Trial API
    |
    v
Demo Tasks
    |
    v
Local Browser Storage
```

The frontend and backend are deployed independently.

This also allows the ASP.NET Core API to be reused by a future mobile client.

---

## Data Model

The current application uses a direct relationship between a user and their tasks.

```text
User
 |
 +-- Task
 |
 +-- Task
 |
 +-- Task
```

A task contains:

```text
Task
├── Title
├── Description
├── Status
│   ├── Todo
│   └── Done
├── Priority
│   ├── Non-priority
│   ├── Priority
│   └── Must
└── Due Date
    ├── Date
    └── None
```

A task without a due date is treated as **unscheduled**.

This keeps the task model simple and allows scheduling to remain optional.

---

## UI and Theme Structure

The frontend uses semantic styling so application colors can be controlled from one central location.

Core theme colors are defined in:

```text
src/index.css
```

The theme includes semantic values for:

- Background
- Foreground text
- Primary buttons and actions
- Non-priority tasks
- Priority tasks
- Must tasks

The current priority colors are:

```text
Non-priority -> Green
Priority     -> Yellow
Must         -> Red
```

Primary actions use the application blue color.

Components reference semantic classes rather than defining individual colors directly inside TSX files.

This means changing the theme values in `index.css` updates the corresponding UI throughout the application.

Repeated frontend logic and UI patterns are also extracted into shared components and utility modules where appropriate.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui

### Backend

- C#
- .NET
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Identity
- JWT Authentication

### Database

- PostgreSQL
- Neon

---

## Deployment

### Frontend

- Vercel
- Custom domain: `lightmanager.jiantao.dev`

### Backend

- Microsoft Azure App Service

### Database

- Neon PostgreSQL

```text
Browser
   |
   v
Vercel
React Frontend
   |
   v
Azure App Service
ASP.NET Core API
   |
   v
Neon
PostgreSQL
```

---

## Project Background

LightManager originally started as a lightweight team project management application with features such as projects, members, role-based permissions, task assignment, and Kanban workflows.

Although the system worked technically, I found that I did not personally need most of the team-oriented workflow.

I therefore redesigned the project around personal task management and simplified both the user experience and the underlying data model.

The current application is built around direct user-to-task ownership and focuses on practical daily task management.

---

## Development Goals

LightManager is not intended to compete with large task management platforms.

The project is primarily a practical environment for building, using, and continuously improving a real full-stack application.

My goals are to:

- Design software around real usage rather than hypothetical requirements
- Keep the product and data model simple as features evolve
- Build reusable and maintainable frontend and backend architecture
- Improve responsive and mobile-first product design
- Explore safe public demo and authentication patterns
- Prepare the architecture for future cross-platform development

The focus is not on adding as many features as possible, but on making deliberate improvements based on actual use.

---

## Future Improvements

Possible future additions include:

- React Native mobile application
- Persistent mobile authentication
- Recurring tasks
- Task notes
- Notifications and reminders
- Offline support
- Cross-device synchronization
- Improved task editing
- Search and filtering
- Optional productivity statistics
- Additional Trial mode improvements

---

## Legacy Azure Static Web Apps Deployment — Abandoned

The original frontend was hosted on **Azure Static Web Apps** at:

`https://thankful-beach-0211add0f.7.azurestaticapps.net`

The current frontend is hosted on **Vercel** at:

**https://lightmanager.jiantao.dev**

The old Azure deployment was only intended to preserve the previous URL and redirect visitors to the current application. After several unsuccessful recovery attempts, I decided to abandon the legacy resource and focus on the actively maintained deployment.

### Recovery Attempts

| Method | Result |
| --- | --- |
| Azure Static Web Apps CLI | Deployment returned `No matching static site found.` |
| Deployment token reset | The same deployment error continued. |
| GitHub Actions | Azure could not match the deployment to the original Static Web App. |
| Azure Portal configuration | Relevant deployment settings were unavailable or read-only. |
| Azure CLI | Direct resource management did not resolve the issue. |
| Azure Cloud Shell | The same resource problem remained. |
| Source-control reconnect | The existing connection could not be successfully recreated. |

### Current Deployment

```text
Frontend
Vercel
https://lightmanager.jiantao.dev

Backend
Microsoft Azure App Service

Database
Neon PostgreSQL
```

The legacy `azurestaticapps.net` URL is no longer considered an active deployment endpoint.

All future development and documentation use:

**https://lightmanager.jiantao.dev**