import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Activity, Map, PieChart, Bell, FileText, Search, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Live Map', path: '/', icon: <Map size={20} /> },
    { name: 'Earthquakes', path: '/earthquakes', icon: <Activity size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <PieChart size={20} /> },
    { name: 'Search', path: '/search', icon: <Search size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: <ShieldAlert size={20} /> });
  }

  return (
    <aside className="w-64 hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-2xl z-40">
      <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 p-2 rounded-xl text-white shadow-lg shadow-brand-500/30">
            <Activity size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Quake<span className="text-brand-500">Vision</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-brand-50 dark:bg-brand-500/10 opacity-100 rounded-xl transition-opacity"></div>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-brand-500 rounded-r-full"></div>
              )}
              <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-brand-500'}`}>
                {item.icon}
              </div>
              <span className="relative z-10">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-3 text-center border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold tracking-wide">SYSTEM ONLINE</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
