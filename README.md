# Smart Campus Hub

Smart Campus Hub is a full-stack web application for campus operations. It helps users manage resources, bookings, maintenance tickets, notifications, profiles, and admin user roles from one place.

## Features

- Google OAuth 2.0 login
- Temporary demo logins for testing
- Resource management
- Booking management
- Ticket management
- Notifications
- Profile page
- Admin user role management
- Role-based route and UI protection

## Tech Stack

**Frontend**

- React
- Vite
- React Router
- Axios
- Bootstrap
- Custom CSS

**Backend**

- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- OAuth2 Client

**Database**

- MySQL

## Prerequisites

Install these before running the project:

- Git
- Node.js and npm
- Java 17
- MySQL Server

## Project Structure

```text
smart-campus-hub/
|-- backend/    # Spring Boot backend
|-- frontend/   # React + Vite frontend
|-- docs/       # Project documents
`-- README.md
```

## 1. Clone The Project

```bash
git clone <repository-url>
cd <repository-folder>
```

Replace `<repository-url>` with the GitHub repository URL.

## 2. Create The Database

Open MySQL and create the database:

```sql
CREATE DATABASE smart_campus_db;
```

The backend currently expects this database name:

```text
smart_campus_db
```

## 3. Configure The Backend

Go to the backend folder:

```bash
cd backend
```

Open:

```text
backend/src/main/resources/application.properties
```

Check that the MySQL username and password match your local MySQL setup:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus_db
spring.datasource.username=root
spring.datasource.password=root
```

If your MySQL username or password is different, update those values locally.

## 4. Set Up Google OAuth

Each developer should create their own Google OAuth client. Do not commit or share your Google client secret in GitHub.

This will not break the login system. The project reads OAuth credentials from a local ignored file, so each machine can use its own Google client ID and secret.

### Create A Google OAuth Client

1. Go to the Google Cloud Console.
2. Create or select a project.
3. Configure the OAuth consent screen if Google asks for it.
4. Create an OAuth client ID.
5. Choose **Web application** as the application type.

Use these local development URLs:

**Authorized JavaScript origin**

```text
http://localhost:5173
```

**Authorized redirect URI**

```text
http://localhost:8080/login/oauth2/code/google
```

### Create The Local Secret File

Inside the `backend` folder, create this file:

```text
.env.properties
```

Add your own Google OAuth credentials:

```properties
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Important: `backend/.env.properties` is ignored by Git and must stay private.

The backend already imports this file through:

```properties
spring.config.import=optional:file:.env.properties
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID:}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET:}
spring.security.oauth2.client.registration.google.scope=openid,profile,email
```

## 5. Run The Backend

From the `backend` folder:

**Windows PowerShell**

```powershell
.\mvnw spring-boot:run
```

**Git Bash, macOS, or Linux**

```bash
./mvnw spring-boot:run
```

The backend should run at:

```text
http://localhost:8080
```

Keep this terminal open while working.

## 6. Run The Frontend

Open a second terminal from the project root, then run:

```bash
cd frontend
npm install
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

Open that URL in your browser.

Keep this terminal open while working.

## 7. Daily Development Commands

Start the backend:

```bash
cd backend
```

Then run the correct Maven wrapper command for your terminal.

Start the frontend:

```bash
cd frontend
npm run dev
```

Stop either server by pressing `Ctrl + C` in its terminal.

## Login Options

**Google OAuth Login**

Use the **Continue with Google** button on the login page.

**Demo Logins**

Temporary demo logins are available for development:

- Demo User
- Demo Admin
- Demo Technician

These are useful for checking role-based screens without signing in through Google every time.

## Main Pages

- `/` - Landing page
- `/login` - Login page
- `/resources` - Resources
- `/bookings` - Bookings
- `/tickets` - Tickets
- `/notifications` - Notifications
- `/profile` - Profile page
- `/admin/users` - Admin role management page

## Roles

**USER**

- View resources
- View bookings
- View tickets
- View notifications
- Create bookings
- Create tickets

**ADMIN**

- Full resource management
- Booking management
- Ticket management
- User role management

**TECHNICIAN**

- View resources
- View bookings
- View tickets
- View notifications
- Manage ticket workflow actions

## Notes For New Developers

- New Google users are automatically created in the database on first login.
- A new user's default role is usually `USER`.
- Admin users can change roles from the **Manage Users** page.
- Work on styling or component adjustments from the `frontend/src` folder.
- Do not commit local secrets, build output, or dependency folders.

## Optional Cleanup

If notifications pile up during testing, you can clear them from MySQL:

```sql
TRUNCATE TABLE notifications;
```

Generated folders can be deleted safely when needed:

- `frontend/dist`
- `backend/target`

They will be recreated by the frontend/backend build commands.

## Troubleshooting

**Backend does not start**

- Check that MySQL is running.
- Check that `smart_campus_db` exists.
- Check your MySQL username and password in `application.properties`.
- Check that Java 17 is installed.

**Google login does not work**

- Check that `backend/.env.properties` exists.
- Check that your Google client ID and secret are correct.
- Check that the redirect URI is exactly `http://localhost:8080/login/oauth2/code/google`.
- Check that the JavaScript origin is exactly `http://localhost:5173`.
- Restart the backend after changing `.env.properties`.

**Frontend cannot fetch backend data**

- Check that the backend is running on `http://localhost:8080`.
- Check that the frontend is running on `http://localhost:5173`.
- Check that you are logged in or using the correct demo login.

