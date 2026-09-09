# LightManager

LightManager is a personal task management application built with React, TypeScript, ASP.NET Core, and PostgreSQL.

The project originally started as a lightweight project management system for small teams, with projects, members, role-based permissions, task assignment, and a Kanban board.

After using and developing the application further, I realized that the team-oriented workflow did not match how I would personally use the product. Because I was not the target user of the original design, it was also difficult to improve the application based on real day-to-day usage.

I therefore redesigned LightManager as a **personal task manager**, focusing on a simpler workflow that I can use myself, test regularly, and improve based on actual experience.

The current version is designed around personal tasks, an inbox, daily planning, and a calendar-oriented workflow, with a strong focus on simplicity and mobile-friendly design.

## Live Demo

[https://lightmanager.jiantao.dev](https://lightmanager.jiantao.dev)

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
- Planning tasks by date
- Viewing today's tasks
- Keeping unscheduled tasks in an inbox
- Managing tasks through a calendar
- Using the application comfortably on both desktop and mobile

This also gives me the opportunity to improve the product continuously based on my own usage rather than designing features only for demonstration purposes.

The web application is being developed first to stabilize the product flow, API, authentication, and data model. A React Native mobile client may be added later using the same ASP.NET Core API.

## Features

- User registration and login
- JWT authentication
- User-specific task data
- Create, update, complete, and delete tasks
- Task priorities
- Due dates
- Today view
- Inbox for unscheduled tasks
- Calendar view
- All tasks view
- Responsive desktop and mobile layout
- Persistent PostgreSQL storage

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

Each authenticated user only has access to their own tasks.

The frontend and backend are deployed independently, which also makes it possible to reuse the same API for a future React Native application.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
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

## Deployment

### Frontend

- Vercel
- Custom domain: `lightmanager.jiantao.dev`

### Backend

- Microsoft Azure App Service

### Database

- Neon PostgreSQL

## Authentication Flow

```text
User Login
    ↓
ASP.NET Identity Validation
    ↓
PostgreSQL
    ↓
JWT Generated
    ↓
Token Stored by Client
    ↓
Authenticated API Requests
    ↓
User-Specific Task Data
```

Protected task endpoints use the authenticated user's identity to ensure that users can only access their own data.

## Project Evolution

### Version 1 — Team Project Management

The original version included:

- Project creation and management
- Project members
- Role-based authorization
- Task assignment
- Kanban board
- Drag-and-drop task management

### Version 2 — Personal Task Management

The application was redesigned around a simpler personal workflow:

```text
Inbox
  ↓
Today / Scheduled Tasks
  ↓
Calendar
  ↓
Completed
```

The backend data model was also simplified from a project/member-based structure to a direct relationship between users and tasks.

```text
Before

User
 └── Project
      ├── Members
      └── Tasks
           └── Assignees


Current

User
 ├── Task
 ├── Task
 └── Task
```

This makes the application easier to maintain, easier to use, and better suited for future mobile development.

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

## Legacy Azure Static Web Apps Deployment - Abandoned

The original LightManager frontend was previously deployed using Azure Static Web Apps at:

`https://thankful-beach-0211add0f.7.azurestaticapps.net`

LightManager has since been redesigned and migrated to a new deployment architecture. The current application is available at:

**https://lightmanager.jiantao.dev**

The old Azure Static Web App was intended to receive one final update that would redirect visitors from the legacy URL to the new domain. However, the deployment resource could no longer be updated successfully.

### What I Tried

I attempted several methods to perform the final redirect deployment.

#### 1. Azure Static Web Apps CLI

I created a minimal static redirect site containing only:

* `index.html`
* `staticwebapp.config.json`

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

However, the relevant configuration options in Azure Portal were disabled/read-only and could not be changed.

#### 5. Azure CLI

I installed Azure CLI and attempted to manage the resource directly.

Local authentication was complicated by tenant/MFA issues, so I later switched to Azure Cloud Shell.

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

## Why I Chose to Stop

The purpose of the old deployment was only to preserve an outdated URL and redirect it to the current application.

At this point, recovering the legacy Azure resource would require significantly more effort than the value provided by maintaining that URL.

Rather than continuing to debug infrastructure that is no longer part of the application's architecture, I chose to focus development effort on the current LightManager deployment and future product improvements.

