# LightManager

LightManager is an open-source web-based application designed to help small to medium-sized teams organize and manage their projects efficiently. Unlike
complex enterprise-level tools, this application focuses on simplicity, usability, and a clean user experience, allowing users to manage projects effectively without unnecessary features or a steep learning curve.

## Page
[light-manager-rho.vercel.app](https://light-manager-rho.vercel.app/)

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

 ### Database
 * PosetgreSQL

## Deployment
### Frontend
* Vercel
### Backend
* Microsoft Azure (App Service)
### Database
* Neon

## Authenticaation Flow
User Login(Vercel) -> ASP.NET Identity Validation(Railway) -> Database(Neon) -> JWT Token Generated (Azure) -> Token Stored in Local Storage (Vercel) -> Protected API Request (Azure)

## Future Improvement
* AI generate tasks according the description of project
* Search and filtering tasks in kanban board
