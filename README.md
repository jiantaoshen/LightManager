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
