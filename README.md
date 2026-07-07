# CCMS - ResolvX 🎓🚀

**CCMS (Campus Complaint Management System) - ResolvX** is a comprehensive, full-stack web application designed to streamline the reporting, tracking, and resolution of student complaints and issues on campus. With a modern, intuitive, and highly responsive user interface, it ensures a seamless experience for students, administrators, and master admins.

---

## 🌟 Features

- **Multi-Role Authentication**: 
  - **Student**: Can register, login, file complaints, and track their status.
  - **Admin**: Can view, manage, and update the status of student complaints.
  - **Master Admin**: Full oversight of the system, including managing admins and overseeing all campus issues.
- **Secure Authentication**: OTP-based verification for secure login and registration.
- **Interactive Dashboards**: Role-specific dashboards presenting relevant metrics, statuses, and quick actions.
- **Real-time Status Tracking**: Students can track whether their complaint is 'Pending', 'In Progress', or 'Resolved'.
- **Modern UI/UX**: Built with React, Tailwind CSS, and Lucide React, featuring glassmorphism, dynamic animations, and a sleek dark mode aesthetic.

## 💻 Tech Stack

### Frontend
- **React 19** (Vite)
- **React Router v7** for seamless navigation
- **Tailwind CSS v4** for modern, responsive styling
- **Lucide React** for beautiful iconography
- **Axios** for API requests

### Backend
- **Node.js & Express.js** for a robust RESTful API
- **MongoDB (Mongoose)** for flexible and scalable data storage
- **JSON Web Tokens (JWT)** for secure, stateless authentication
- **Bcrypt** for password hashing
- **Nodemailer** for OTP and email notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mr-Sherin/CCMS-ResolvX.git
   cd CCMS-ResolvX
   ```

2. **Setup the Backend**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_email
   SMTP_PASS=your_email_password
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` to explore the app!

## 📄 Documentation

For a more in-depth look at the project architecture, API endpoints, and database schemas, please refer to the [DOCUMENTATION.md](DOCUMENTATION.md) file.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Mr-Sherin/CCMS-ResolvX/issues).

## 📝 License

This project is licensed under the MIT License.
