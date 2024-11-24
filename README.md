# TaskHive Backend

**TaskHive** is a collaborative task management system designed to streamline project tracking, task assignments, and user roles. Built with **Nest.js** and **TypeScript**, it leverages TypeORM for database interactions and supports modular design for scalability.

---

## Features

- **User Roles**: Fine-grained role-based access control, including:
  - **Admin**: Full system control.
  - **Owner**: Project creator with complete project-level control.
  - **Project Manager**: Manages tasks and team members within a project.
  - **Contributor**: Works on assigned tasks.
  - **Viewer**: Read-only access for monitoring progress.
  - **User** (default): Access to open/public APIs only.
- **Task Management**: Create, update, and track tasks with statuses and priorities.
- **Project Collaboration**: Multi-user collaboration with role-based permissions.
- **Scalable Architecture**: Modular design for easy feature expansion.
- **Secure Authentication**: JWT-based authentication with role validation.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sujeet-agrahari/task-hive.git
   cd task-hive

   ```

2. Install dependencies:

   ```bash
     npm install
   ```

3. Set up environment variables:
   • Create a .env file in the root directory.
   • Add the following:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=yourusername
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=taskhive
JWT_SECRET=your_jwt_secret
```

4. Run the application:

```bash
npm run start:dev
```

5. Access the API at http://localhost:3000.

### Database

TaskHive uses PostgreSQL as the database. Run the following commands to set up the database:

```sql
CREATE DATABASE taskhive;
CREATE USER taskhive_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE taskhive TO taskhive_user;
```

The application will automatically synchronize entities with the database when running in development mode.

## Roles and Permissions

### Role Description

- Admin: Full system access, including user and project management.
- Owner: Project owner with full control over their projects.
- Project: Manager Oversees specific projects, manages tasks, and assigns team roles.
- Contributor: Works on tasks assigned within projects.
- Viewer: Read-only access to view project progress and tasks.
- User: Default role with access to open/public APIs only.

## API Endpoints

- Public Endpoints (Accessible by the user role)

  • GET /api/projects/public - Fetch public projects.
  • GET /api/system/status - Check system health.

- Protected Endpoints (Role-Specific)

  • POST /api/projects - Create a new project (requires owner or admin role).
  • PATCH /api/tasks/:id - Update a task (requires contributor or higher).
  • DELETE /api/projects/:id - Delete a project (requires owner or admin).

Refer to the detailed API documentation for more endpoints.

## Running Tests

- Run unit tests:

```bash
npm run test
```

- Run end-to-end tests:

```bash
  npm run test:e2e
```

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/your-feature
```

3. Commit your changes:

```bash
git commit -m "Add your message here"
```

4. Push to the branch:

```bash
git push origin feature/your-feature
```

5. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
