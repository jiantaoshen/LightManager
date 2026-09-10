# LightManager

LightManager is a personal task management application built with React, TypeScript, ASP.NET Core, and PostgreSQL.

The project originally started as a lightweight project management system for small teams, with projects, members, role-based permissions, task assignment, and a Kanban board.

After using and developing the application further, I realized that the team-oriented workflow did not match how I would personally use the product. Because I was not the target user of the original design, it was also difficult to improve the application based on real day-to-day usage.

I therefore redesigned LightManager as a **personal task manager**, focusing on a simpler workflow that I can use myself, test regularly, and improve based on actual experience.

The current version is designed around quick task capture, daily planning, optional scheduling, and a calendar-oriented workflow. The Today view acts as the main workspace, combining tasks scheduled for today with unscheduled tasks in one place.

The application also includes a Trial mode that allows visitors to explore the application using demo task data without creating an account. Changes made during a Trial session are stored locally in the browser and do not modify the demo account in the database.

## Live Demo

https://lightmanager.jiantao.dev

Visitors can either create an account, sign in, or enter **Trial mode** to explore the application immediately.

## Why I Changed the Direction

The first version of LightManager was designed for small teams and included concepts such as:

- Projects
- Project members
- Role-based permissions
- Task assignment
- Kanban workflows

Although these features worked technically, I found that I had little reason to use the application myself.

Instead of continuing to add features for a hypothetical user group, I decided to redesign the application around a workflow that I actually need.

The new direction focuses on:

- Quickly capturing tasks
- Creating tasks with or without a due date
- Planning tasks by date
- Viewing today's tasks and unscheduled tasks together
- Prioritizing important tasks with a simple three-level system
- Managing scheduled tasks through a calendar
- Using the application comfortably on both desktop and mobile
- Allowing visitors to explore the application through a safe Trial mode

This also gives me the opportunity to improve the product continuously based on my own usage rather than designing features only for demonstration purposes.

The web application is being developed first to stabilize the product flow, API, authentication, and data model. A React Native mobile client may be added later using the same ASP.NET Core API.

## Features

- User registration and login
- JWT authentication
- User-specific task data
- Trial mode for visitors
- Local-only task changes during Trial mode
- Create, update, complete, and delete tasks
- Optional due dates
- Three-level task priority system
  - Non-priority
  - Priority
  - Must
- Automatic priority-based task sorting
- Today view with today's tasks and unscheduled tasks
- Calendar view
- Calendar priority indicators
- Unscheduled tasks available directly from the Calendar view
- All tasks view
- Responsive desktop and mobile layout
- Persistent PostgreSQL storage for authenticated users

## Task Workflow

Tasks do not need to belong to a separate inbox.

Instead, scheduling is determined directly by the task's due date.

```text
Create Task
    |
    +-- No due date
    |      |
    |      v
    |   Unscheduled
    |
    +-- Due today
    |      |
    |      v
    |   Today
    |
    +-- Future date
           |
           v
        Calendar
```

The Today page acts as the main working area:

```text
Today
|
+-- Today's Tasks
|
+-- Unscheduled Tasks
```

This removes the need for a separate Inbox page and keeps task capture and daily planning in one place.

## Priority System

LightManager uses three simple priority levels:

```text
Must
  |
  v
Priority
  |
  v
Non-priority
```

Internally, these currently correspond to the original priority values:

```text
High   -> Must
Medium -> Priority
Low    -> Non-priority
```

Tasks are automatically sorted by priority:

1. Must
2. Priority
3. Non-priority

Tasks with the same priority are ordered by creation time, with older tasks appearing first.

This sorting is used consistently across Today, Unscheduled tasks, and Calendar task lists.

## Calendar Priority Indicators

The Calendar provides a quick visual indication of the most important unfinished task scheduled for each day.

The indicator color is determined by the highest priority among that day's unfinished tasks:

```text
Blue   -> Non-priority
Yellow -> Priority
Red    -> Must
```

For example:

```text
Non-priority only
        -> Blue

Non-priority + Priority
        -> Yellow

Priority + Must
        -> Red
```

Completed tasks do not affect the Calendar priority indicator.

If all tasks for a date are completed, the priority indicator is no longer shown.

The Calendar also includes an **Unscheduled** section so tasks without a due date remain accessible while planning future work.

## Trial Mode

LightManager includes a Trial mode for visitors who want to explore the application without registering.

The Trial starts with task data based on a dedicated demo account.

```text
Visitor
   |
   v
Trial Mode
   |
   v
Load Demo Tasks
   |
   v
Browser Local Storage
```

Once the Trial data has been loaded, task changes are handled locally.

Visitors can:

- Create tasks
- Complete and reopen tasks
- Delete tasks
- Change task data
- Add or remove due dates
- Change priorities
- Use Today
- Use Calendar
- Use All Tasks

These changes affect only the visitor's local browser state.

```text
Trial Change
    |
    +-- Create
    +-- Update
    +-- Complete
    +-- Delete
    |
    v
Local Storage

    X

PostgreSQL
```

Trial users do not receive the demo account's authentication credentials or JWT token.

This prevents visitors from modifying the original demo task data in PostgreSQL.

Authenticated users continue to use the normal protected API and persistent database storage.

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

For authenticated users:

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

For Trial users:

```text
React Client
    |
    v
Read Demo Tasks
    |
    v
Local Browser State
```

Each authenticated user only has access to their own tasks.

The frontend and backend are deployed independently, which also makes it possible to reuse the same API for a future React Native application.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router

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

## Deployment

### Frontend

- Vercel
- Custom domain: `lightmanager.jiantao.dev`

### Backend

- Microsoft Azure App Service

### Database

- Neon PostgreSQL

## Authentication Flow

For registered users:

```text
User Login
    |
    v
ASP.NET Identity Validation
    |
    v
PostgreSQL
    |
    v
JWT Generated
    |
    v
Token Stored by Client
    |
    v
Authenticated API Requests
    |
    v
User-Specific Task Data
```

Protected task endpoints use the authenticated user's identity to ensure that users can only access their own data.

Trial users follow a separate flow and do not receive an authenticated user token.

```text
Enter Trial
    |
    v
Load Demo Task Data
    |
    v
Store Local Trial Copy
    |
    v
Use Application Locally
```

## Project Evolution

### Version 1 — Team Project Management

The original version included:

- Project creation and management
- Project members
- Role-based authorization
- Task assignment
- Kanban board
- Drag-and-drop task management

The original data model was centered around projects and team membership.

```text
User
 └── Project
      ├── Members
      └── Tasks
           └── Assignees
```

### Version 2 — Personal Task Management

The application was redesigned around a much simpler personal task model.

```text
User
 ├── Task
 ├── Task
 └── Task
```

The first version of the personal workflow used a separate Inbox:

```text
Inbox
  |
  v
Today / Scheduled Tasks
  |
  v
Calendar
  |
  v
Completed
```

### Version 3 — Simplified Daily Planning

The workflow was simplified again by removing the separate Inbox concept.

Unscheduled tasks are now displayed directly inside the Today view.

```text
                Today
                  |
        +---------+---------+
        |                   |
        v                   v
Today's Tasks          Unscheduled
        |
        v
     Calendar
```

Tasks can now be created either with or without a due date.

The Calendar was also expanded to:

- Display unscheduled tasks
- Sort tasks by priority
- Show priority-colored date indicators based on the most important unfinished task scheduled for each day

A Trial mode was added so visitors can explore the application using demo data without being able to modify the demo account in the database.

These changes make the application simpler to navigate, easier to understand, and closer to the workflow I use in everyday life.

## Current Data Model

The current application uses a direct relationship between users and tasks.

```text
User
 |
 +-- Task
 |
 +-- Task
 |
 +-- Task
```

A task can have:

```text
Title

Description

Status
├── Todo
└── Done

Priority
├── Non-priority
├── Priority
└── Must

Due Date
├── Date
└── None
```

A missing due date does not represent a separate task state.

It simply means that the task is **unscheduled**.

This keeps the data model simple and allows the frontend to organize tasks into Today, Unscheduled, Calendar, and All Tasks views without additional project or inbox entities.

## Future Improvements

- React Native Android application
- Persistent mobile login
- Recurring tasks
- Task notes
- Notifications and reminders
- Offline task storage
- Synchronization between mobile and web
- Improved task editing
- Search and filtering
- Optional productivity statistics
- Additional Trial mode improvements

## Development Goals

LightManager is not intended to compete with large task management platforms.

The goal of the project is to build a small application that I can genuinely use while continuing to improve my skills in:

- Full-stack application architecture
- React and TypeScript
- ASP.NET Core
- REST API design
- Authentication and authorization
- PostgreSQL and Entity Framework Core
- Cloud deployment
- Responsive and mobile-first design
- Cross-platform application development
- Designing safe public demo environments
- Building software around real personal usage rather than hypothetical requirements

## Legacy Azure Static Web Apps Deployment — Abandoned

The original LightManager frontend was previously deployed using Azure Static Web Apps at:

`https://thankful-beach-0211add0f.7.azurestaticapps.net`

LightManager has since been redesigned and migrated to a new deployment architecture.

The current application is available at:

**https://lightmanager.jiantao.dev**

The old Azure Static Web App was intended to receive one final update that would redirect visitors from the legacy URL to the new domain. However, the deployment resource could no longer be updated successfully.

### What I Tried

I attempted several methods to perform the final redirect deployment.

#### 1. Azure Static Web Apps CLI

I created a minimal static redirect site containing only:

- `index.html`
- `staticwebapp.config.json`

and attempted to deploy it using:

```powershell
swa deploy . --env production
```

The deployment failed through `StaticSitesClient`.

Running the CLI with verbose logging:

```powershell
swa deploy --env production . --dry-run --verbose silly
```

revealed the underlying Azure response:

```text
BadRequest
Reason: No matching static site found.
```

#### 2. Resetting the Deployment Token

The deployment token for the original Static Web App was reset in Azure Portal and added again as:

```text
SWA_CLI_DEPLOYMENT_TOKEN
```

The same deployment error continued.

#### 3. GitHub Actions Deployment

I then attempted to bypass the local SWA CLI by using:

```text
Azure/static-web-apps-deploy@v1
```

A GitHub repository secret was configured as:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN
```

After verifying that GitHub Actions could access the secret successfully, the deployment reached Azure but was rejected with:

```text
BadRequest

Reason:
No matching Static Web App was found or the api key was invalid.
```

The redirect files themselves were successfully generated and detected by the deployment action, so the problem was not caused by the application files or build configuration.

#### 4. Azure Deployment Configuration

I attempted to inspect and change the deployment authorization configuration of the original Static Web App.

However, the relevant configuration options in Azure Portal were disabled or read-only and could not be changed.

#### 5. Azure CLI

I installed Azure CLI and attempted to manage the resource directly.

Local authentication was complicated by tenant and MFA issues, so I later switched to Azure Cloud Shell.

The plan was to disconnect the existing source-control integration and reconnect the Static Web App to the current LightManager repository:

```text
az staticwebapp disconnect
az staticwebapp reconnect
```

However, the disconnect operation also failed, preventing the source-control relationship from being recreated.

## Final Decision

After trying:

* SWA CLI deployment
* Deployment token reset
* GitHub Actions deployment
* Azure Portal deployment configuration
* Azure CLI
* Azure Cloud Shell
* Source-control disconnect/reconnect

I decided not to spend additional development time recovering the legacy Azure Static Web Apps resource.

The purpose of the old deployment was only to preserve an outdated URL and redirect visitors to the current application. At this point, recovering the legacy resource would require significantly more effort than the value provided by maintaining that URL.

The old deployment is therefore considered **abandoned**.

This does not affect the current LightManager application.

The actively maintained version now uses:

```text
Frontend
Vercel
https://lightmanager.jiantao.dev

Backend
Microsoft Azure App Service

Database
PostgreSQL / Neon
```

All documentation, portfolio links, and future development will use:

**https://lightmanager.jiantao.dev**

The legacy `azurestaticapps.net` URL should no longer be considered an active deployment endpoint.

Rather than continuing to debug infrastructure that is no longer part of the application's architecture, I chose to focus development effort on the current LightManager deployment and future product improvements.
