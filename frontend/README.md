# Smart Campus Hub

Smart Campus Hub is a full-stack web application designed to support campus operations through one centralized platform. The system allows users to manage resources, create bookings, submit maintenance tickets, receive notifications, and manage user roles through an admin interface.

---

## Features

- Google OAuth 2.0 login
- Temporary demo logins for testing
- Resource management
- Booking management
- Ticket management
- Notifications system
- Profile page
- Admin user role management
- Role-based route and UI protection

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Bootstrap
- Custom CSS

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- OAuth2 Client

### Database
- MySQL

---

## Prerequisites

Make sure these are installed on your machine:

- Node.js
- npm
- Java 17
- MySQL Server
- Git

---

## Project Structure

```text
smart-campus-hub/
│
├── frontend/   # React + Vite frontend
├── backend/    # Spring Boot backend
└── README.md
````

how to do :-
---

## 1. Clone the Project

```bash
git clone <your-repository-url>
cd smart-campus-hub
```

---

## 2. Create the Database

Open MySQL and run:

```sql
CREATE DATABASE smart_campus_db;
```

---

## 3. Backend Setup

### Go to the backend folder

```bash
cd backend
```

### Configure safe OAuth properties

In:

```
backend/src/main/resources/application.properties
```

make sure these lines exist:

```properties
spring.config.import=optional:file:.env.properties

spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID:}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET:}
spring.security.oauth2.client.registration.google.scope=openid,profile,email
```

### Create a local secret file

Create this file inside the `backend` folder:

```
.env.properties
```

Add your real Google OAuth credentials there:

```properties
GOOGLE_CLIENT_ID=your_real_google_client_id
GOOGLE_CLIENT_SECRET=your_real_google_client_secret
```

### Ignore the local secret file

In:

```
backend/.gitignore
```

add:

```gitignore
.env.properties
```

### Configure database connection

In `application.properties`, make sure your MySQL settings match your local setup. Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Run the backend

For Windows PowerShell:

```powershell
.\mvnw spring-boot:run
```

For Git Bash / macOS / Linux:

```bash
./mvnw spring-boot:run
```

The backend should run on:

```
http://localhost:8080
```

---

## 4. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

---

## 5. Google OAuth Setup

This project uses Google OAuth 2.0 login.

Create a Google OAuth client and configure the following:

### Authorized Redirect URI

```
http://localhost:8080/login/oauth2/code/google
```

### Authorized JavaScript Origin

```
http://localhost:5173
```

Then copy the generated Google client ID and secret into:

```
backend/.env.properties
```

---

## 6. Running the Project

You need both backend and frontend running at the same time.

### Backend

```
http://localhost:8080
```

### Frontend

```
http://localhost:5173
```

Open the frontend URL in your browser to use the system.

---

## 7. Login Options

### Google OAuth Login

Use the **Continue with Google** button on the login page.

### Demo Logins

For easier testing during development, temporary demo logins are available:

* Demo User
* Demo Admin
* Demo Technician

These are useful for testing role-based UI and permissions without signing in to Google repeatedly.

---

## 8. Main Pages

* `/` - Landing page
* `/login` - Login page
* `/resources` - Resources
* `/bookings` - Bookings
* `/tickets` - Tickets
* `/notifications` - Notifications
* `/profile` - Profile page
* `/admin/users` - Admin role management page

---

## 9. Roles

### USER

* View resources
* View bookings
* View tickets
* View notifications
* Create bookings
* Create tickets

### ADMIN

* Full resource management
* Booking management
* Ticket management
* User role management

### TECHNICIAN

* View resources
* View bookings
* View tickets
* View notifications
* Manage ticket workflow actions

---

## 10. Notes for New Users

* New Google users are automatically created in the database on first login.
* Default role is usually `USER`.
* Admin users can change user roles from the **Manage Users** page.
* Temporary demo logins exist only for easier testing and development.

---

## 11. Reset Notifications (Optional)

If notifications pile up during testing, you can clear them from MySQL:

```sql
TRUNCATE TABLE notifications;
```

---

## 12. Common Troubleshooting

### Backend does not start

Check:

* MySQL is running
* database name is correct
* username/password are correct
* Java 17 is installed

### Google login does not work

Check:

* client ID and secret are correct
* redirect URI is exactly:
  `http://localhost:8080/login/oauth2/code/google`
* JavaScript origin is exactly:
  `http://localhost:5173`

### Frontend cannot fetch backend data

Check:

* backend is running on port 8080
* frontend is running on port 5173
* backend session/auth config is not broken