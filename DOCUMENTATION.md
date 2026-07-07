# 📚 CCMS ResolvX - Technical Documentation

This document provides a deep dive into the architecture, database schema, and API routes of the **CCMS ResolvX** system.

---

## 🏛️ Architecture Overview

The system follows a standard Client-Server architecture utilizing the **MERN** stack (MongoDB, Express, React, Node.js). 

- **Frontend (Client)**: A Single Page Application (SPA) built with React. It handles routing internally via `react-router-dom` and uses the Context API for state management (AuthContext, ThemeContext, ActiveButtonContext).
- **Backend (API)**: A RESTful API built on Node.js and Express. It serves JSON responses, handles business logic, and interacts with the database.
- **Database**: MongoDB serves as the NoSQL data store, queried using Mongoose schemas.

---

## 🗄️ Database Schemas (Models)

The application uses three primary models:

### 1. User (`User.js`)
Stores information about the system users (Students, Admins, Master Admins).
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: `['Student', 'Admin', 'MasterAdmin']`, default: `'Student'`)
- `department` (String)
- `studentId` (String, unique for students)

### 2. Complaint (`Complaint.js`)
Stores the details of complaints filed by students.
- `title` (String, required)
- `description` (String, required)
- `category` (String, e.g., 'Academic', 'Hostel', 'Infrastructure', 'Other')
- `status` (String, enum: `['Pending', 'In Progress', 'Resolved', 'Rejected']`, default: `'Pending'`)
- `student` (ObjectId, ref: 'User')
- `assignedTo` (ObjectId, ref: 'User', optional)
- `createdAt` / `updatedAt` (Timestamps)

### 3. OTP (`Otp.js`)
Handles secure one-time passwords for email verification and password resets.
- `email` (String, required)
- `otp` (String, required)
- `createdAt` (Date, expires after 5 minutes)

---

## 🔌 API Endpoints

The backend exposes several modular routes grouped by their purpose. All protected routes require a valid JWT passed in the `Authorization` header as a Bearer token.

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and return a JWT
- `POST /api/auth/verify-otp` - Verify an email OTP

### Complaints (`/api/complaints`)
- `GET /api/complaints` - Get all complaints (Admin/MasterAdmin) or user-specific complaints (Student)
- `POST /api/complaints` - File a new complaint (Student)
- `GET /api/complaints/:id` - Get details of a specific complaint
- `PUT /api/complaints/:id/status` - Update the status of a complaint (Admin)

### Admin Operations (`/api/admin`)
- `GET /api/admin/dashboard` - Fetch dashboard statistics (total complaints, pending, resolved)
- `GET /api/admin/students` - Fetch list of registered students

### Master Admin Operations (`/api/master`)
- `GET /api/master/admins` - Fetch list of all system admins
- `POST /api/master/admins` - Create a new admin account
- `DELETE /api/master/admins/:id` - Remove an admin

---

## 🎨 Frontend Structure

The React frontend is structured for maintainability and scalability:

- `/src/assets/` - Static assets, images, and global styles.
- `/src/components/` - Reusable UI components (Buttons, Modals, Cards, Navbars).
- `/src/context/` - Global state management (Authentication, Themes).
- `/src/pages/` - Top-level route components (`Home.jsx`, `Login.jsx`, `StudentDashboard.jsx`, etc.).
- `/src/services/` - API interaction layer (`api.js` utilizing Axios).

### Routing and Protection
The application utilizes a `ProtectedRoute` wrapper to ensure unauthenticated users are redirected to `/login`. Furthermore, a `RoleRoute` wrapper ensures users can only access dashboards relevant to their authorization level (e.g., stopping a Student from accessing the Admin Dashboard).

---

## 🔐 Security Features
- **Password Hashing**: Utilizing `bcrypt` before storing any passwords in the database.
- **Stateless Sessions**: JWTs are used for secure session management without server-side memory overhead.
- **CORS Protection**: The backend is configured to accept requests only from trusted origins using the `cors` middleware.
- **Role-Based Access Control (RBAC)**: Enforced on both the React frontend and the Express backend.
