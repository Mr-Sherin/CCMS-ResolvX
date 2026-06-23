import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import Button from './Button';
import resolvxIcon from '../assets/resolvx_icon.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-white/5 backdrop-blur-md">
      {/* Brand logo */}
      <div className="flex items-center gap-2">
        <img src={resolvxIcon} alt="ResolvX Icon" className="w-8 h-8 object-contain" />
        <span className="font-bold text-xl tracking-wider text-slate-900 dark:text-white">
          ResolvX
        </span>
      </div>

      {/* Actions (Theme toggle + User actions) */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          className="p-2 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user.name}</p>
                <p className="text-[10px] text-cyan-600 dark:text-cyan-400/80 font-mono tracking-tight -mt-0.5">{user.role}</p>
              </div>
            </div>

            <Button
              id="btn-navbar-logout"
              onClick={handleLogout}
              variant="danger"
              className="flex items-center justify-center p-2 rounded-lg"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
