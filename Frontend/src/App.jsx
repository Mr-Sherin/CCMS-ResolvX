import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ActiveButtonProvider } from './context/ActiveButtonContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintList from './pages/ComplaintList';
import ComplaintDetails from './pages/ComplaintDetails';
import MasterAdmin from './pages/MasterAdmin';
import { ShieldAlert, Home as HomeIcon } from 'lucide-react';
import './App.css';

// Protected Route check: checks if user is logged in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="animated-bg min-h-screen flex items-center justify-center text-white">
        <span className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Role check: verifies the logged in user is of the specific allowed role
const RoleRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="animated-bg min-h-screen flex items-center justify-center text-white">
        <span className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // Redirect unauthorized roles back to their correct page
    return user.role === 'Admin' 
      ? <Navigate to="/admin-dashboard" replace />
      : <Navigate to="/student-dashboard" replace />;
  }

  return children;
};

// 404 Page Not Found Component
const NotFound = () => {
  return (
    <div className="animated-bg min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-panel max-w-md p-8 rounded-lg border-white/10 space-y-5">
        <div className="inline-flex p-3 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-lg font-semibold text-slate-300">Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The link you requested may be broken, or the page has been moved to a restricted admin zone.
        </p>
        <a
          href="/"
          className="glass-button w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold font-medium shadow-sm"
        >
          <HomeIcon className="w-4 h-4" />
          Back to Portal
        </a>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ActiveButtonProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Protected Routes */}
              <Route
                path="/student-dashboard"
                element={
                  <RoleRoute allowedRole="Student">
                    <StudentDashboard />
                  </RoleRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <RoleRoute allowedRole="Admin">
                    <AdminDashboard />
                  </RoleRoute>
                }
              />

              {/* Shared Protected Routes */}
              <Route
                path="/complaints"
                element={
                  <ProtectedRoute>
                    <ComplaintList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complaint/:id"
                element={
                  <ProtectedRoute>
                    <ComplaintDetails />
                  </ProtectedRoute>
                }
              />

              {/* Master Admin Route */}
              <Route path="/admin" element={<MasterAdmin />} />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ActiveButtonProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
