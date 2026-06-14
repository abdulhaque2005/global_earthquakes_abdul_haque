import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { Sun, Moon, LogOut, Menu, Bell, Activity } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ toggleMobileMenu }) => {
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 w-full sticky top-0 z-30 bg-white/80 dark:bg-[#020817]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="bg-gradient-to-tr from-brand-600 to-emerald-400 p-1.5 rounded-lg text-white shadow-md shadow-brand-500/30">
            <Activity size={16} />
          </div>
          <span className="font-display font-bold text-slate-900 dark:text-white tracking-tight text-sm">
            Quake<span className="text-brand-500">Vision</span>
          </span>
        </div>
      </div>

      {/* Center: Live Status */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live Feed Active</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-brand-500 dark:hover:text-brand-400 transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <Sun size={18} className="transition-transform duration-300 rotate-0 hover:rotate-90" />
            : <Moon size={18} className="transition-transform duration-300" />
          }
        </button>

        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 ml-1">
            {/* Alerts quick link */}
            <Link
              to="/alerts"
              className="p-2 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-200"
              aria-label="Alerts"
            >
              <Bell size={18} />
            </Link>

            {/* User avatar + name */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{user.name}</p>
                <p className="text-xs font-medium text-brand-500 dark:text-brand-400 capitalize">{user.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-500/25 cursor-pointer ring-2 ring-white dark:ring-slate-900 hover:ring-brand-500/50 transition-all duration-200">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
