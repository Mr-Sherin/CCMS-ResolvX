import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';
import {
  LayoutDashboard,
  FileSpreadsheet,
  PlusCircle,
  LogOut,
  ShieldCheck,
  User
} from 'lucide-react';

const Sidebar = ({ onOpenRaiseForm }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
      isActive
        ? 'bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white'
        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
    }`;

  return (
    <aside className="w-full md:w-56 md:h-[calc(100vh-80px)] py-4 flex flex-col justify-between md:sticky md:top-24">
      {/* Top Navigation Links */}
      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-medium tracking-wide px-4 mb-3">
            Navigation
          </p>
          <nav className="space-y-1">
            {user?.role === 'MasterAdmin' ? (
              <NavLink to="/admin" className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4" />
                Manage Admins
              </NavLink>
            ) : user?.role === 'Admin' ? (
              <>
                <NavLink to="/admin-dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </NavLink>
                <NavLink to="/complaints" className={navLinkClass}>
                  <FileSpreadsheet className="w-4 h-4" />
                  Review Logs
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/student-dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Student Dashboard
                </NavLink>
                <NavLink to="/complaints" className={navLinkClass}>
                  <FileSpreadsheet className="w-4 h-4" />
                  My Complaints
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Shortcuts / Quick Actions */}
        {user?.role === 'Student' && onOpenRaiseForm && (
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-medium tracking-wide px-4 mb-3">
              Quick Action
            </p>
            <Button
              id="btn-sidebar-file"
              onClick={onOpenRaiseForm}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-sm transition-all duration-200 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              File Complaint
            </Button>
          </div>
        )}
      </div>

      {/* Footer Identity Block */}
      <div className="border-t border-slate-200 dark:border-white/5 pt-4 mt-6">
        <div className="flex items-center gap-3 px-2 py-1 mb-4">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
            {user?.role === 'MasterAdmin' ? (
              <ShieldCheck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            ) : user?.role === 'Admin' ? (
              <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <div className="truncate w-full">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            {user?.role === 'Student' && user?.admissionNo && (
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">ID: {user.admissionNo} {user.semester && `(${user.semester})`}</p>
            )}
            {user?.role === 'Admin' && user?.staffId && (
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">ID: {user.staffId}</p>
            )}
            {user?.role === 'MasterAdmin' && (
              <p className="text-[10px] text-yellow-600 dark:text-yellow-400 font-mono">ID: Master Admin</p>
            )}
            {user?.department && (
              <p className="text-[10px] text-slate-500 dark:text-slate-450 italic truncate">{user.department}</p>
            )}
          </div>
        </div>

        <Button
          id="btn-sidebar-logout"
          onClick={handleLogout}
          variant="danger"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium border border-transparent text-rose-600 dark:text-rose-450 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 transition duration-200"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
