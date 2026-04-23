# Smart Campus Hub

Smart Campus Hub is a full-stack web application for campus operations. It helps users manage resources, bookings, maintenance tickets, notifications, role dashboards, profiles, and admin user roles from one place.

## Features

- Google OAuth 2.0 login
- Temporary demo logins for testing
- Resource catalogue and admin resource management
- Resource availability time windows
- Booking requests with conflict and availability validation
- Booking approval, rejection, and cancellation workflow
- Maintenance ticket workflow with admin/technician handling
- Per-user notifications
- Role-based dashboards and analytics
- Profile page
- Admin user role management
- Role-based backend security and frontend route protection
- Meaningful API error messages for validation and workflow failures
- Dark modern UI styling across the app

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

## Build / Verification Commands

Run backend tests from the `backend` folder:

```bash
./mvnw test
```

On Windows PowerShell:

```powershell
.\mvnw.cmd test
```

Run the frontend production build from the `frontend` folder:

```bash
npm run build
```

The frontend build creates `frontend/dist`. This folder is generated output and should not be committed.

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
- `/dashboard` - Role-based dashboard
- `/profile` - Profile page
- `/admin/users` - Admin role management page

Protected pages such as bookings, tickets, notifications, dashboard, profile, and admin user management require login. If a logged-out user opens a protected page, the app redirects to the landing page and shows a login-required prompt.

## Roles

**USER**

- View resources
- Create and view their own bookings
- Create and view their own tickets
- View their own notifications
- Use the user dashboard

**ADMIN**

- Full resource management
- Review, approve, reject, and cancel bookings
- View and manage tickets
- Assign technicians to tickets
- User role management
- View admin notifications and analytics dashboard

**TECHNICIAN**

- View resources
- View assigned tickets
- Update ticket workflow actions
- View technician notifications and analytics dashboard

## Current Workflows

**Resources**

- Admin can create, edit, and delete resources.
- Resources include type, capacity, location, status, and available start/end times.
- Users can browse and filter resources.

**Bookings**

- Logged-in users can request bookings.
- The backend checks for overlapping bookings and resource availability windows.
- Admin can approve, reject, or cancel bookings with reasons.
- Notifications are sent to the correct users/admins.

**Tickets**

- Logged-in users can create maintenance tickets.
- Admin can assign tickets to technicians.
- Admin or technician can update ticket status.
- Ticket updates notify the correct user/technician.

**Notifications**

- Each user only sees their own notifications.
- Notifications can be filtered by read status and type.
- Notification cards link users to the related module.

**Dashboards**

- Admin dashboard shows resource, booking, ticket, and notification analytics.
- User dashboard shows the user's booking/ticket activity.
- Technician dashboard shows assigned ticket activity and priority/status breakdowns.

## Notes For New Developers

- New Google users are automatically created in the database on first login.
- A new user's default role is usually `USER`.
- Admin users can change roles from the **Manage Users** page.
- Dashboard is opened from the profile dropdown after login.
- Bookings, tickets, notifications, profile, and dashboard are protected routes.
- Work on styling or component adjustments from the `frontend/src` folder.
- Do not commit local secrets, build output, or dependency folders.
- Do not commit `backend/.env.properties`, `frontend/node_modules`, `frontend/dist`, or `backend/target`.

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
- Resources are public, but bookings, tickets, notifications, dashboard, and profile require login.
- If resources also fail to load, the backend is probably not running or MySQL/backend startup failed.

**Bookings or tickets redirect to the landing page**

- This is expected when you are not logged in.
- Login with Google or one of the demo roles first.

## Submission Notes

- Do not include compiled/generated folders in the final zip.
- Do not include local OAuth secrets.
- Include screenshots or Postman evidence for key workflows in the final report.
- Disclose AI tool usage in the report/progress documentation if required by the module instructions.

