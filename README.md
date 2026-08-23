# LightManager

LightManager is an open-source web-based application designed to help small to medium-sized teams organize and manage their projects efficiently. Unlike
complex enterprise-level tools, this application focuses on simplicity, usability, and a clean user experience, allowing users to manage projects effectively without unnecessary features or a steep learning curve.

## Updates (2026 August)
Change hosting platform from vercel and render to Microsoft Azure Free Tier.

## Live Demo
[https://thankful-beach-0211add0f.7.azurestaticapps.net](https://thankful-beach-0211add0f.7.azurestaticapps.net)

## Demo Account 
You can use the following account to test the application:

Email: 1@test.se
Password: Abc_123

Note: The application is deployed using a free-tier cloud service. A cold start is normal when the backend has been inactive for some time. The first login or API request may therefore take 1–2 minutes. Once the backend is running, subsequent requests should respond normally.

## Features
* Authentication
* Authorization
* Create/Edit/Delete/Archive projects
* Role-based permissions
* Create/Edit/Delete tasks
* Assign member in the project to task
* Drag and drop kanban board

## Tech Stack
### Frontend
* React
* TypeScript
* Vite
* Tailwind CSS

### Backend
* ASP.NET Core Web API
* Entity Framework Core
* ASP.NET Identity
* JWT Authentication

## Deployment
### Frontend
* Microsoft Azure (Static Web Apps Free Tier)
### Backend
* Microsoft Azure (App Service Free Tier)
### Database
* Neon

## Authenticaation Flow
User Login -> ASP.NET Identity Validation -> Database-> JWT Token Generated -> Token Stored in Local Storageb -> Protected API Request

## Future Improvement
* AI generate tasks according the description of project
* Search and filtering tasks in kanban board
